import _isFunction from 'lodash/isFunction'

export const WIZARD_TYPES = {
  WIZARD: 'Wizard',
  STEP: 'Step',
  GROUP: 'Group',
  COMPONENT: 'Component',
  INPUT: 'Input',
}

export const WIZARD_DEFAULT_COMPONENTS = {
  STEPPER: 'Stepper',
  TITLE: 'Title',
  TYPOGRAPHY: 'Typography',
  SUBMIT_BUTTON: 'SubmitButton',
  TEXT: 'Text',
  ROWS: 'Rows',
}

export function getIsConditionMet(child, values) {
  const value = values[child.conditional.when]
  return value === child.conditional.equals
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
  // Initial step can come from 3 places
  let initialStep
  // Firstly, the name passed to Wizard
  if (initialStepName) {
    initialStep = getStepByName(definition, initialStepName)
    if (initialStep) {
      return initialStep
    } else {
      console.warn(
        `Wizard Definition "${
          definition.name
        }" does not have a step named "${initialStepName}"`,
      )
    }
  }

  // Secondly, the defaultStepName included in the definition
  if (definition.defaultStepName) {
    initialStep = getStepByName(definition, definition.defaultStepName)
    if (initialStep) {
      return initialStep
    } else {
      console.warn(
        `Wizard Definition "${definition.name}" has a defaultStepName of "${
          definition.defaultStepName
        }" but does not have a step with this name`,
      )
    }
  }

  // Finally, the default is the first step in the definition
  const steps = definition.children.filter(
    child => child.type === WIZARD_TYPES.STEP,
  )
  if (steps.length) {
    initialStep = steps[0]
  }

  return initialStep
}

export function getStepsArray(definition, initialStep) {
  const steps = []

  if (!initialStep) {
    initialStep = getInitialStep(definition)
    if (!initialStep) return steps
  }

  function pushStep({ name, label }) {
    steps.push({ name, label })
  }

  function getIsCircular({ name }) {
    return Boolean(steps.find(s => s.name === name))
  }

  function pushNextSteps(currentStep) {
    if (currentStep.nextStep) {
      const nextStep = getStepByName(definition, currentStep.nextStep)
      if (!nextStep) return
      if (getIsCircular(nextStep)) {
        console.warn(
          `Wizard definition "${definition.name}" has circular steps: "${
            currentStep.name
          }", ${nextStep.name}`,
        )
        return
      }
      pushStep(nextStep)
      pushNextSteps(nextStep)
    }
    return
  }

  pushStep(initialStep)
  pushNextSteps(initialStep)
  return steps
}

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

function getInputDefaultValue(input) {
  if (input.defaultValue !== undefined) {
    return input.defaultValue
  } else {
    switch (input.type) {
      default:
        return ''
    }
  }
}
