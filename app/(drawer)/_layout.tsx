import CustomDrawerContent from "@/components/CustomDrawerContent";
import { setTheme } from "@/redux/themeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DrawerLayout() {
  const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");

      if (savedTheme === "dark") {
        dispatch(setTheme(true));
      } else {
        dispatch(setTheme(false));
      }
    };

    loadTheme();
  }, []);
  return (
<Drawer
  screenOptions={{
    headerShown: false,
      sceneContainerStyle: {
          backgroundColor: darkMode ? "#0F172A" : "#FFFFFF", 
        },
  }}
  
  drawerContent={(props) => <CustomDrawerContent {...props} />}
>
 <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: 'none' }, // Hides it from showing as a default list item
        }}
      />


</Drawer>
  );
}
