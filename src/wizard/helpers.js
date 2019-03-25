import lodash from 'lodash'
import deepdash from 'deepdash'
import _isFunction from 'lodash/isFunction'

const _ = deepdash(lodash)

export const WIZARD_TYPES = {
  WIZARD: 'Wizard',
  STEP: 'Step',
  GROUP: 'Group',
  COMPONENT: 'Component',
  INPUT: 'Input',
}

export function getInputs(o) {
  return o.children.filter(c => c.type === WIZARD_TYPES.INPUT)
}

export function getGroups(o) {
  return o.children.filter(c => c.type === WIZARD_TYPES.GROUP)
}

export function getArrayGroups(o) {
  return o.children.filter(c => c.multiple && WIZARD_TYPES.GROUP)
}

export function getInitialValues(step) {
  if (!step || !step.children || !step.children.length) return {}
  return step.children.reduce(function reduceInputs(inputMap, child) {
    if (child.type === WIZARD_TYPES.INPUT) {
      inputMap[child.name] = getInputDefaultValue(child)
    } else if (child.type === WIZARD_TYPES.GROUP) {
      let values = child.children.reduce(reduceInputs, {})
      inputMap[child.name] = child.multiple ? [values] : values
    }
    return inputMap
  }, {})
}

export function getInputDefaultValue(input) {
  if (input.defaultValue !== undefined) {
    return input.defaultValue
  } else {
    switch (input.type) {
      default:
        return ''
    }
  }
}

export function getStepByName(definition, name) {
  const nextStep = definition.children
    .filter(({ type }) => type === WIZARD_TYPES.STEP)
    .find(step => step.name === name)
  if (!nextStep) {
    console.warn(
      `Wizard Definition "${
        definition.name
      }" does not contain a step named "${name}"`,
    )
  }
  return nextStep
}

export function getInitialStep(definition, initialStepName) {
  let initialStep
  if (initialStepName) {
    initialStep = getStepByName(definition, initialStepName)
  }
  if (!initialStep) {
    if (initialStepName)
      console.warn(
        `Wizard Definition "${
          definition.name
        }" does not have a step named "${initialStepName}". Defaulting to "${
          definition.defaultStepName
        }"`,
      )
    initialStep = getStepByName(definition, definition.defaultStepName)
  }
  if (!initialStep) {
    throw new Error(
      `Wizard Definition "${definition.name}" is invalid. The default step "${
        definition.defaultStepName
      }" does not exist`,
    )
  }
  return initialStep
}

// export function getInitialValues(inputs, initialValues = {}) {
//   const _initialValues = { ...initialValues }
//   for (const input of inputs) {
//     if (initialValues[input.name] === undefined) {
//       const defaultValue = getInputDefaultValue(input)
//       _initialValues[input.name] = defaultValue
//     }
//   }
//   return _initialValues
// }

export function getHandlersFor(eventName, handlers, step) {
  const _handlers = []
  if (!step || !step.handlers) return _handlers
  const handlerDefinitions = step.handlers.filter(({ on }) => on === eventName)
  for (const handlerDefinition of handlerDefinitions) {
    const handler = handlers[handlerDefinition.name]
    if (!handler || !_isFunction(handler)) {
      console.warn(
        `Wizard step "${step.name}" is missing handler "${
          handlerDefinition.name
        }" for ${eventName}.`,
      )
    }
    _handlers.push(handler)
  }
  return _handlers
}
