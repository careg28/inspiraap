import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}