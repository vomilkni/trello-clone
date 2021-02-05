import React, {createContext, useReducer, useContext} from "react"
import { v4 as uuidv4 } from 'uuid';
import { findItemIndexById } from "./utils/findItemIndexById";
import { moveItem } from "./utils/moveItem";
import { DragItem } from './DragItem'


const appData: AppState = {
    lists: [
        {
            id: "0",
            text: "ToDo",
            tasks: [{id: "0", text: "Work"}]
        }
    ],
    draggedItem: undefined
}

type Action = 
    |   {
            type: "ADD_LIST"
            payload: string
        }
    |   {
            type: "ADD_TASK"
            payload: { text: string, taskId: string }
        }
    |   {
            type: "MOVE_LIST"
            payload: { dragIndex: number, hoverIndex: number }
        }
    |   {
            type: "SET_DRAGGED_ITEM"
            payload: DragItem | undefined
        }

const appStateReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case "ADD_LIST": {
            return {
                ...state,
                lists: [
                    ...state.lists, 
                    { id: uuidv4(), text: action.payload, tasks: [] }
                ]
            }
        }
        case "ADD_TASK": {
            const targetLaneIndex = findItemIndexById(state.lists, action.payload.taskId)
            state.lists[targetLaneIndex].tasks.push({
                id: uuidv4(),
                text: action.payload.text
            })
            
            return {
                ...state
            }
        }
        case "MOVE_LIST": {
            const {dragIndex, hoverIndex} = action.payload
            state.lists = moveItem(state.lists, dragIndex, hoverIndex)
            return {...state}
        }
        case "SET_DRAGGED_ITEM": {
            return { ...state, draggedItem: action.payload}
        }        
        default: {
            return state
        }
    }
}

interface Task {
    id: string
    text : string
}

interface List {
    id: string,
    text: string,
    tasks: Task[]
}

export interface AppState {
    lists: List[],
    draggedItem: DragItem | undefined
}

interface AppStateContextProps {
    state: AppState
    dispatch: React.Dispatch<Action>
}

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps)

export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [state, dispatch] = useReducer(appStateReducer, appData)

    return (
        <AppStateContext.Provider value = {{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}

export const useAppState = () => {
    return useContext(AppStateContext)
}