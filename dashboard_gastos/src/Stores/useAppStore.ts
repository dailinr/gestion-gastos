import { create } from "zustand";
import { devtools } from 'zustand/middleware'
import { createCuentaSlice, type cuentaSliceType } from "./cuentaSlice";
import { createRecursoSlice, type recursoSliceType } from "./recursoSlice";
  
export const useAppStore = create<cuentaSliceType & recursoSliceType>()(devtools((...a) => ({
    ...createCuentaSlice(...a),
    ...createRecursoSlice(...a),
})))