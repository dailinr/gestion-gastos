import { create } from "zustand";
import { devtools } from 'zustand/middleware'
import { createCuentaSlice, type cuentaSliceType } from "./cuentaSlice";
import { createRecursoSlice, type recursoSliceType } from "./recursoSlice";
import { createAhorroSlice, type ahorroSliceType } from "./ahorroSlice";
  
export const useAppStore = create<cuentaSliceType & recursoSliceType & ahorroSliceType>()(devtools((...a) => ({
    ...createCuentaSlice(...a),
    ...createRecursoSlice(...a),
    ...createAhorroSlice(...a)
})))