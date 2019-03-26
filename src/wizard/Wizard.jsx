import React from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'

import useWizard from './useWizard'
import { WIZARD_TYPES, getIsConditionMet } from './helpers'

export default function Wizard({ definition, handlers, components }) {
  const { initialValues, step, handleSubmit } = useWizard(definition, handlers)

  if (!step) return <p>done!</p>

  return (
    <div>
      <Formik
        key={step.name}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ isSubmitting, values }) => {
          function renderChild(child, key) {
            const Component = components[child.component]
            if (!Component) {
              console.error(
                `Wizard does not have component: "${child.component}"`,
              )
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
                            child.children.map(
                              (groupChild, groupChildIndex) => {
                                const name =
                                  child.name +
                                  `.[${rowIndex}].` +
                                  groupChild.name
                                const clone = { ...groupChild, name }
                                return renderChild(clone, name)
                              },
                            ),
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
                  const group = child.children.map(
                    (groupChild, groupChildIndex) => {
                      const name = child.name + '.' + groupChild.name
                      const clone = { ...groupChild, name }
                      return renderChild(clone, groupChildIndex)
                    },
                  )
                  return (
                    <Component
                      name={child.name}
                      group={group}
                      {...child.props}
                    />
                  )
                }
              default:
                console.warn(`Wizard does not implement type: "${child.type}"`)
                return null
            }
          }
          return (
            <Form>
              {step.children.map(renderChild)}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )
        }}
      />
    </div>
  )
}
