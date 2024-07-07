import { toggle } from "slide-element";
import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode,
  title?: String,
  icon: ReactNode
}

export const Accordion = ({children, title, icon}: Props) => {
  const open = (e: {target: any }) => {
    const el = e.target.closest('.el-accordion');
    const target = el.querySelector('.el-accordion__container');
    toggle(target);
  }

  return (
    <div className="el-accordion">
      <div className="el-accordion__holder" onClick={(e) => open(e)}>
        <div className="el-accordion__heading">
          <h1>{title}</h1>
        </div>
        <div className="el-accordion__holder--icn">
          {icon}
        </div>
      </div>
      <div className="el-accordion__container">
        <div className="el-accordion__inner">
          {children}
        </div>
      </div>
    </div>
  )
}