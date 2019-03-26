import React from 'react'
import ReactDOM from 'react-dom'

import ThemeProvider from './ThemeProvider'
import npsw from './npsw.json'
import Wizard from './wizard/Wizard'
import * as wizardComponents from './wizard-material-ui'

/*
  - Intended Use, RichText
  - Overview, RichText
  - Risks, Array
    - Description, Text
    - Potential Impact, Text
    - Mitigation, Text
  - User Requirements, Array
    - Description, Text
  - Software Requirements, Array
    - Description, Text
  - Is a spreadsheet template?, Boolean
    - Spreadsheet Requirements, Array / Checkbox
  - In Scope of 21 CFR Part 11?, Boolean
    - Using electronic records?, Boolean
      - Electronic Record Requirements, Array / Checkbox
    - Using electronic signatures?, Boolean
  - Using PHI?, Boolean
  - Configuration Management, Select
  - Change Management, Select
  - Issue Management, Select
  - Verification Protocol, Array
    - User Requirement ID, Multi-Select
    - Test Case Description, Object
      - Description, Text
      - Steps, Array
        - Step, Text
      - Verify, Text
      - Objective Evidence Obtained via, Radio or Text
    - Expected Result, Text
*/

function App() {
  return (
    <ThemeProvider>
      <div style={{ margin: 16 }}>
        <Wizard
          definition={npsw}
          handlers={{
            updateContent: values => {
              console.log(`updating content`, values)
            },
          }}
          components={wizardComponents}
        />
      </div>
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
