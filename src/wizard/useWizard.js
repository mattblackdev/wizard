import { useMemo, useReducer } from 'react'

import {
  getInitialStep,
  getInitialValues,
  getStepByName,
  getHandlersFor,
  getStepsArray,
} from './helpers'

const ACTIONS = {
  SUBMIT: 'submit',
  SUBMIT_SUCCESS: 'submit_success',
  SUBMIT_FAIL: 'submit_fail',
}

export default function useWizard(definition, handlers, options = {}) {
  const initialStep = useMemo(
    () => getInitialStep(definition, options.initialStepName),
    [definition, options.initialStepName],
  )

  const steps = useMemo(() => getStepsArray(definition, initialStep), [
    definition,
    initialStep,
  ])

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case ACTIONS.SUBMIT_SUCCESS: {
          const { values } = action
          const nextStep = state.step.nextStep
            ? getStepByName(definition, state.step.nextStep)
            : null
          return {
            step: nextStep,
            values: {
              ...state.values,
              [state.step.name]: values,
            },
          }
        }
        default: {
          console.warn(`Unknown action type ${action.type} called on useWizard`)
          return state
        }
      }
    },
    {
      step: initialStep,
      values: options.initialValues || {},
    },
  )

  const initialValues = useMemo(
    () => getInitialValues(state.step, options.initialValues),
    [state.step, options.initialValues],
  )

  function handleSubmit(values, actions) {
    const submitHandlers = getHandlersFor('nextStep', handlers, state.step)
    Promise.all(submitHandlers.map(handler => Promise.resolve(handler(values))))
      .then(() => {
        actions.setSubmitting(false)
        actions.resetForm()
        dispatch({
          type: ACTIONS.SUBMIT_SUCCESS,
          values,
        })
      })
      .catch(e => {
        console.error(e)
      })
  }

  const activeStepIndex = useMemo(
    () => steps.findIndex(({ name }) => name === state.step.name),
    [steps, state.step],
  )

  return {
    initialValues,
    step: state.step,
    steps,
    activeStepIndex,
    handleSubmit,
  }
}
