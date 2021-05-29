import React from 'react';
/**
 * 
 * 
 * @children 渲染图片
 * @name 渲染昵称 
 * 
 * 
 * 
 * 
 */
 const Bubble = (props) => {
  const { type = 'text', content,name,children } = props;
  return (
    <div>
      <div className="Bubble-header">{type=='text'?name?name:"无名女侠":null}</div>
      <div className={`Bubble ${type}`} data-type={type}>     
        {content && <p>{content}</p>}
        {children}
      </div>
    </div>
  );
};

export default Bubble