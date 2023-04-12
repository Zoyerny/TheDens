import { AppDispath, RootState } from "@/redux/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispath = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;