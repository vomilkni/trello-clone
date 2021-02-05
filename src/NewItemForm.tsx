import React, { useState } from 'react'
import { NewItemFormContainer, NewItemButton, NewItemInput } from './styles'
import { useFocus } from './utils/useFocus'

interface NewItemFormProps {
    onAdd(text: string): void
}

export const NewItemForm = (props: NewItemFormProps) => {
    // useState - хук реакта. Хуки используются чтобы "подцепиться" н инфр-ре реакта в функциональных компонентах (т.к. нет ссылки на this). В классах не работают
    // На вход получает начальное значение, возвращает массив из 2х элементов: свойство из state'а и функция, меняющая state. 
    // Синтаксис [a, b] = array - это деструктуризация массива
    const [text, setText] = useState("")
    const {onAdd} = props;
    const inputRef = useFocus()

    return (
        <NewItemFormContainer>
            <NewItemInput 
                ref={inputRef}
                value={text} 
                onChange={e => setText(e.target.value)}/>
            <NewItemButton onClick={() => onAdd(text)}>
                Create
            </NewItemButton>
        </NewItemFormContainer>
    )
}