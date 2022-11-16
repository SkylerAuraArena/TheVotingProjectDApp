import { useMainContext } from "../../../contexts/MainContext"

export const Button = ({ title, color, func, setter }) => {

  const { handleKeyboardBtnClick } = useMainContext()

  const css = `w-36 p-3 border-2 rounded-2xl text-white text-center text-base font-medium shadow-shadowBox hover:shadow-shadowBoxHover ${color}`

  const handleClick = e => {
    const txt = e.target.title
    handleKeyboardBtnClick(txt)
    func && func(title)
    setter && setter([`Entraînement : ${title}`, title])
  }

  return (
    <button className={css} title={title} onClick={(e) => handleClick(e)}>{title}</button>
  )
}