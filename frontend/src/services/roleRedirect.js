export const getDashboardRoute = (role) => {
  switch (role) {
    case "owner":
      return "/dashboard/owner";

    case "admin":
      return "/admin";

    default:
      return "/dashboard/user";
  }
};