export default function StateComponent(state: boolean) {
  return ({ children, or }: { children: React.ReactNode; or: Array<any> | any }) => {
    if (state) {
      return children;
    }
    if (or) {
      let newOr = or;
      if (!Array.isArray(or)) {
        newOr = [or];
      }
      if (newOr.length === 0) return null;
      newOr = [...newOr];
      const Component = newOr.shift();
      return Component({ children, or: newOr });
    }
    return null;
  };
}
