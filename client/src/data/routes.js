import Homepage from "../components/Pages/Homepage/Homepage"
import Login from "../components/Pages/Login/Login"
import Showcase from "../components/Pages/Showcase/Showcase"
import AddNewClothes from "../components/Pages/AddNewClothes/AddNewClothing"
import App from "../components/App"

const routes = [
    {
      path: '',
      element: <App />,
      children: [
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/Homepage',
          element: <Homepage />,
        },
        {
          path: '/Showcase',
          element: <Showcase />,
        },
        {
          path: '/AddNewClothes',
          element: <AddNewClothes />,
        },
      ],
    },
  ];
  
  export default routes;