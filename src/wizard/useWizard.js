import { useMemo, useReducer } from 'react'

import {
  getInitialStep,
  getInputs,
  getInitialValues,
  getStepByName,
  getHandlersFor,
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
      values: options.values || {},
    },
  )
  console.info(`${definition.name} state`, state)

  // const inputs = useMemo(() => (state.step ? getInputs(state.step) : []), [
  //   state.step,
  // ])
  const initialValues = useMemo(
    () => getInitialValues(state.step, options.initialValues),
    [state.step, options.initialValues],
  )

  function handleSubmit(values, actions) {
    const submitHandlers = getHandlersFor('nextStep', handlers, state.step)
    Promise.all(
      submitHandlers.map(handler => Promise.resolve(handler(values))),
    ).then(() => {
      actions.setSubmitting(false)
      actions.resetForm()
      dispatch({
        type: ACTIONS.SUBMIT_SUCCESS,
        values,
      })
    })
  }

  return { initialValues, step: state.step, handleSubmit }
}
