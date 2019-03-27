import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  waitForDomChange,
} from 'react-testing-library'
import userEvent from 'user-event'

import Wizard from '../src/wizard'
import { WIZARD_TYPES, WIZARD_DEFAULT_COMPONENTS } from '../src/wizard/helpers'

afterEach(cleanup)

const getBasicWizardDefinition = () => ({
  type: 'Wizard',
  name: 'basic',
  children: [
    {
      type: 'Step',
      name: 'step1',
      label: 'Step 1',
      children: [],
      nextStep: 'step2',
    },
    {
      type: 'Step',
      name: 'step2',
      label: 'Step 2',
      children: [],
      nextStep: 'step3',
    },
    {
      type: 'Step',
      name: 'step3',
      label: 'Step 3',
      children: [],
    },
  ],
})

it('starts on the first step by default', () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const { getByText } = render(<Wizard definition={definition} />)
  // Assert
  expect(() => getByText('Step 1')).not.toThrow()
})

it('starts on the default step name', () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  definition.defaultStepName = 'step2'
  const { getByText } = render(<Wizard definition={definition} />)
  // Assert
  expect(() => getByText('Step 2')).not.toThrow()
})

it('starts on the initialStep prop', () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const { getByText } = render(
    <Wizard definition={definition} initialStepName="step3" />,
  )
  // Assert
  expect(() => getByText('Step 3')).not.toThrow()
})

it('goes to the next step', async () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const { getByText } = render(<Wizard definition={definition} />)
  // Act
  fireEvent.click(getByText('Submit'))
  // Assert
  await waitForElement(() => getByText('Step 2'))
})

it('calls multiple handlers on submit', async () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  definition.children[0].handlers = [
    {
      on: 'nextStep',
      name: 'handler1',
    },
    {
      on: 'nextStep',
      name: 'handler2',
    },
  ]

  const { getByText } = render(
    <Wizard definition={definition} handlers={{ handler1, handler2 }} />,
  )

  // Act
  fireEvent.click(getByText('Submit'))
  await waitForDomChange()
  // Assert
  expect(handler1.mock.calls.length).toBe(1)
  expect(handler2.mock.calls.length).toBe(1)
})

it('displays the correct components', async () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const titleText = 'This is a title'
  const typographyText = 'This is some text'
  const textInputPlaceholder = 'This is an input'

  definition.children[0].children = [
    {
      type: WIZARD_TYPES.COMPONENT,
      component: WIZARD_DEFAULT_COMPONENTS.TITLE,
      props: {
        children: titleText,
      },
    },
    {
      type: WIZARD_TYPES.COMPONENT,
      component: WIZARD_DEFAULT_COMPONENTS.TYPOGRAPHY,
      props: {
        children: typographyText,
      },
    },
    {
      type: WIZARD_TYPES.INPUT,
      component: WIZARD_DEFAULT_COMPONENTS.TEXT,
      props: {
        placeholder: textInputPlaceholder,
      },
    },
  ]

  const { getByText, getByPlaceholderText } = render(
    <Wizard definition={definition} />,
  )

  // Assert
  expect(getByText(titleText).tagName).toBe('H4')
  expect(getByText(typographyText).tagName).toBe('P')
  expect(getByPlaceholderText(textInputPlaceholder).tagName).toBe('INPUT')
})

it('conditionally displays components', async () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const valueToShowField2 = 'foobar'

  const field1 = 'field1'
  const field2 = 'field2'

  definition.children[0].children = [
    {
      type: WIZARD_TYPES.INPUT,
      component: WIZARD_DEFAULT_COMPONENTS.TEXT,
      name: field1,
      props: {
        'data-testid': field1,
      },
    },
    {
      type: WIZARD_TYPES.INPUT,
      component: WIZARD_DEFAULT_COMPONENTS.TEXT,
      name: field2,
      props: {
        'data-testid': field2,
      },
      conditional: {
        show: true,
        when: field1,
        equals: valueToShowField2,
      },
    },
  ]

  const { getByTestId } = render(<Wizard definition={definition} />)
  // Act
  expect(() => getByTestId(field2)).toThrow()
  userEvent.type(getByTestId(field1), valueToShowField2)
  // Assert
  await waitForElement(() => getByTestId(field2))
})

it('passes data to submit handler', async () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const handler1 = jest.fn()
  const field1 = 'field1'
  const inputValue = 'foobar'

  definition.children[0].handlers = [
    {
      on: 'nextStep',
      name: 'handler1',
    },
  ]

  definition.children[0].children = [
    {
      type: WIZARD_TYPES.INPUT,
      component: WIZARD_DEFAULT_COMPONENTS.TEXT,
      name: field1,
      props: {
        'data-testid': field1,
      },
    },
  ]

  const { getByText, getByTestId } = render(
    <Wizard definition={definition} handlers={{ handler1 }} />,
  )

  // Act
  userEvent.type(getByTestId(field1), inputValue)
  fireEvent.click(getByText('Submit'))
  await waitForDomChange()

  // Assert
  expect(handler1).toBeCalledWith({ [field1]: inputValue })
})

it('passes nested data to submit handler', async () => {
  // Arrange
  const definition = getBasicWizardDefinition()
  const handler1 = jest.fn()
  const groupName = 'groupName'
  const field1 = 'field1'
  const inputValue1 = 'foobar1'
  const inputValue2 = 'foobar2'

  definition.children[0].handlers = [
    {
      on: 'nextStep',
      name: 'handler1',
    },
  ]

  definition.children[0].children = [
    {
      type: WIZARD_TYPES.GROUP,
      name: groupName,
      component: WIZARD_DEFAULT_COMPONENTS.ROWS,
      multiple: true,
      children: [
        {
          type: WIZARD_TYPES.INPUT,
          component: WIZARD_DEFAULT_COMPONENTS.TEXT,
          name: field1,
          props: {
            'data-testid': field1,
          },
        },
      ],
    },
  ]

  const { getByText, getAllByTestId } = render(
    <Wizard definition={definition} handlers={{ handler1 }} />,
  )

  // Act
  userEvent.type(getAllByTestId(field1)[0], inputValue1)
  fireEvent.click(getByText('Add'))
  await waitForDomChange()
  userEvent.type(getAllByTestId(field1)[1], inputValue2)
  fireEvent.click(getByText('Submit'))
  await waitForDomChange()

  // Assert
  expect(handler1).toBeCalledWith({
    [groupName]: [{ [field1]: inputValue1 }, { [field1]: inputValue2 }],
  })
})
