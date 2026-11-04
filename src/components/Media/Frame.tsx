import type { ReactNode } from "react";
import type { Frame as FrameKind } from "../../data/chapters";
import "./Media.css";

type Props = { kind?: FrameKind; children: ReactNode; className?: string; style?: React.CSSProperties };

// 모든 이미지를 같은 모양의 틀에 담아 정돈: screen = 브라우저 창, doc = 종이 문서
function Frame({ kind = "screen", children, className = "", style }: Props) {
  return (
    <div className={`frame frame--${kind} ${className}`} style={style}>
      {kind === "screen" && (
        <div className="frame__bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      )}
      <div className="frame__view">{children}</div>
    </div>
  );
}

export default Frame;
