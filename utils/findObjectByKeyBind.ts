export const findObjectByKeyBind = (list: any[], keyBindValue: string) => {
  return list.find((obj) => obj.key_bind === keyBindValue);
};
