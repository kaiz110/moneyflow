import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './src/redux/reducers'
import { persistReducer, persistStore} from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import Route from './src/navigation'
import { ThemeProvider } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

const App = () => {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <Route/>
      </ThemeProvider> 
    </PersistGate>
  </Provider>
}

export default App