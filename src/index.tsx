import * as React from 'react'
import styles from './styles.module.css'
import ReactDOM from 'react-dom'

export function hookUp(hud: HTMLDivElement) {
  ReactDOM.render(<ExampleComponent text='testing' />, hud);
}

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export function hello() {
  console.log('hello')
}
