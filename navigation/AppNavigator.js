import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import EditarPostScreen from '../screens/EditarPostScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen}
        />
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen}
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen}
        />
        <Stack.Screen 
          name="EditarPost" 
          component={EditarPostScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}