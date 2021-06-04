import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './src/redux/reducers'
import Route from './src/navigation'
import { ThemeProvider } from 'react-native-elements'

const store = createStore(reducer)

const App = () => {
  return <Provider store={store}>
    <ThemeProvider>
      <Route/>
    </ThemeProvider> 
  </Provider>
}

export default App