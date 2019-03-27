import React from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'

import useWizard from './useWizard'
import { WIZARD_TYPES, getIsConditionMet } from './helpers'

const defaultDefinition = {
  type: WIZARD_TYPES.WIZARD,
  children: [
    {
      type: WIZARD_TYPES.STEP,
      name: 'step1',
      children: [],
    },
  ],
}

const defaultComponents = {
  Stepper: props => <p>{props.step.label}</p>,
  Title: props => <h4 children="" {...props} />,
  Typography: props => <p children="" {...props} />,
  SubmitButton: ({ isLastStep, ...props }) => (
    <Field component="button" {...props}>
      Submit
    </Field>
  ),
  Text: ({ form, field, ...props }) => <input {...props} {...field} />,
  Rows: props => (
    <div>
      {props.groups.map((group, groupIndex) => (
        <div key={groupIndex} style={{ display: 'flex' }}>
          {group.map((field, fieldIndex) => (
            <div key={fieldIndex} style={{ flex: 1, padding: 8 }}>
              {field}
            </div>
          ))}
        </div>
      ))}
      <div>
        <button
          onClick={() => {
            props.arrayHelpers.push(props.initialValues)
          }}>
          Add
        </button>
      </div>
    </div>
  ),
}

export default function Wizard({
  definition = defaultDefinition,
  handlers = [],
  components: Components = defaultComponents,
  ...options
}) {
  const {
    initialValues,
    handleSubmit,
    step,
    steps,
    activeStepIndex,
  } = useWizard(definition, handlers, options)

  if (!step) return null
  return (
    <Formik
      key={step.name}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={({ isSubmitting, values }) => {
        return (
          <Form>
            {Components.Stepper && (
              <Components.Stepper
                activeStepIndex={activeStepIndex}
                step={step}
                steps={steps}
              />
            )}

            {step.children.map((child, key) =>
              renderChild(child, key, Components, values, initialValues),
            )}

            {Components.SubmitButton && (
              <Components.SubmitButton
                type="submit"
                disabled={isSubmitting}
                isLastStep={Boolean(step.nextStep) ? false : true}
              />
            )}
          </Form>
        )
      }}
    />
  )
}

function renderChild(child, key, components, values, initialValues) {
  const Component = components[child.component]
  if (!Component) {
    console.error(`Wizard does not have component: "${child.component}"`)
    return null
  }

  if (child.conditional) {
    const conditionMet = getIsConditionMet(child, values)
    const { show } = child.conditional
    if ((show && !conditionMet) || (!show && conditionMet)) {
      return null
    }
  }

  switch (child.type) {
    case WIZARD_TYPES.COMPONENT:
      return <Component key={key} {...child.props} />
    case WIZARD_TYPES.INPUT:
      return (
        <Field
          key={key}
          name={child.name}
          component={Component}
          {...child.props}
        />
      )
    case WIZARD_TYPES.GROUP:
      if (child.multiple) {
        return (
          <FieldArray
            key={key}
            name={child.name}
            render={arrayHelpers => {
              const groups = arrayHelpers.form.values[child.name].map(
                (row, rowIndex) =>
                  child.children.map((groupChild, groupChildIndex) => {
                    const name =
                      child.name + `.[${rowIndex}].` + groupChild.name
                    const clone = { ...groupChild, name }
                    return renderChild(
                      clone,
                      name,
                      components,
                      values,
                      initialValues,
                    )
                  }),
              )
              return (
                <Component
                  arrayHelpers={arrayHelpers}
                  name={child.name}
                  groups={groups}
                  initialValues={initialValues[child.name][0]}
                  {...child.props}
                />
              )
            }}
          />
        )
      } else {
        const group = child.children.map((groupChild, groupChildIndex) => {
          const name = child.name + '.' + groupChild.name
          const clone = { ...groupChild, name }
          return renderChild(
            clone,
            groupChildIndex,
            components,
            values,
            initialValues,
          )
        })
        return <Component name={child.name} group={group} {...child.props} />
      }
    default:
      console.warn(`Wizard does not implement type: "${child.type}"`)
      return null
  }
}
