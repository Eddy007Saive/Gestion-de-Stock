import {
  HomeIcon,
  ServerStackIcon,
  RectangleStackIcon,
  MapPinIcon,
  TruckIcon,
  CubeIcon,
  GlobeAltIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/solid";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routeS = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Acceuil",
        path: "/home", // Chemin complet avec /dashboard
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Produit",
        path: "/produit", // Chemin complet avec /dashboard
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "Fournisseur",
        path: "/fournisseur", // Chemin complet avec /dashboard
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Approvissionement",
        path: "/station", // Chemin complet avec /dashboard
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "Commande",
        path: "/commande", // Chemin complet avec /dashboard
      },
      {
        icon: <GlobeAltIcon {...icon} />,
        name: "Stock",
        path: "/voyage", // Chemin complet avec /dashboard
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/auth/sign-in", // Chemin complet avec /auth
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/auth/sign-up", // Chemin complet avec /auth
      },
    ],
  },
];

export default routeS;