import 'react-native-gesture-handler'
import React from 'react'
import { View, Text } from 'react-native'
import Route from './src/navigation'
import { ThemeProvider } from 'react-native-elements'


const App = () => {
  return <ThemeProvider>
    <Route/>
  </ThemeProvider> 
}

export default App