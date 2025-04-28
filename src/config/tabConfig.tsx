
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "../app/screens/home/HomeScreen";
import SearchScreen from "../app/screens/search/SearchScreen";
import ActivityScreen from "../app/screens/activity/ActivityScreen";
import ProfileNavigator from "../app/navigation/ProfileNavigator";
import PostScreen from "../app/screens/post/PostScreen";

export const tabs = [
  { 
    name: 'Home', 
    icon: 'home', 
    component: HomeScreen, 
    iconComponent: MaterialIcons 
  },
  { 
    name: 'Search', 
    icon: 'search', 
    component: SearchScreen, 
    iconComponent: Ionicons 
  },
  { 
    name: 'Post', 
    icon: 'add-circle', 
    component: PostScreen, 
    iconComponent: MaterialIcons 
  },
  { 
    name: 'Activity', 
    icon: 'notifications-circle-outline', 
    component: ActivityScreen, 
    iconComponent: Ionicons 
  },
  { 
    name: 'Profile', 
    icon: 'user-circle', 
    component: ProfileNavigator, 
    iconComponent: FontAwesome5 
  },
];  