import React, { useRef, useEffect, useState, ReactElement } from "react";

// ツールバー内のドロップダウン用コンポーネント
const Dropdown = ({ children, title }: {
  children: ReactElement,
  title: string
}) => {
  const node = useRef(null) as any;
  const [show, setShow] = useState<boolean>(false);

  const clickOutside = (e: any) => {
    if (node && !node.current.contains(e.target)) setShow(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', clickOutside);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, []);

  return (
    <div
      className='dropdown el-mapping__item'
      style={{ position: 'relative' }}
      ref={node}
    >
      <button
        onClick={() => { setShow(!show); }}
      >{title}</button>
      <div
        className='dropdown-content'
        style={{ display: show ? 'flex' : 'none' }}
      >
        {children}
      </div>
    </div>
  )
}

export default Dropdown;