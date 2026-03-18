import { useState } from 'react'
import { useStore } from '../../store.jsx'

export default function IntentionInput({ onDone }) {
  const { state, dispatch } = useStore()
  const [text, setText] = useState(state.session?.intention ?? '')

  const handleSave = () => {
    dispatch({ type: 'SET_INTENTION', intention: text })
    onDone?.()
  }

  return (
    <div className="intention-modal" onClick={handleSave}>
      <div className="intention-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="intention-heading">기도 지향</h3>
        <p className="intention-hint">
          성모님께 드리고 싶은 매듭이나 지향을 적어두세요.
          <br />
          비워도 기도를 시작할 수 있습니다.
        </p>
        <textarea
          className="intention-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 가족의 화해, 직장 문제, 건강…"
          rows={4}
          autoFocus
        />
        <button className="btn-primary intention-confirm" onClick={handleSave}>
          확인
        </button>
      </div>
    </div>
  )
}
