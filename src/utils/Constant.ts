
export function getISTDate() {
  const someDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(someDate.getTime() + istOffset);

  const defaultValues = istDate.toISOString().split("T")[0];
  const defaultValuestime = istDate.toISOString();

  return {
      defaultValues,
      defaultValuestime,
  };
}
// export function getMenuData() {

//   const menuId:any = sessionStorage.getItem("menuId");
//   const menuName = sessionStorage.getItem("menuName");

//   return {
//     menuId, menuName
//   };
// }

export function getId() {
  let ID:any = localStorage.getItem("username");
  try {
    return JSON.parse(ID);
  } catch (error) {
    console.error("Error parsing ID from localStorage:", error);
    return null;
  }
}

export function getdivisionId(){
  let divId = localStorage.getItem("id");
  return divId;
}

export function getinstId(){
  let instId = localStorage.getItem("inst_id");
  return instId;
}