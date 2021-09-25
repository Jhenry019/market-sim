import React, { useState, useEffect, useContext } from 'react';
import classNames from '../../utils/classNames';
import { AlertContext } from '../../context/alert';
import styles from './index.module.scss';


export interface AlertProps {
  /** The message to be rendered inside the alert */
  children?: string;
  /** The type of alert being delivered */
  Type?: "success" | "error";
  /** A selector to be used in testing environments */
  dataTestId?: string;
};

export default function Alert({
  Type = "success", 
  children = "",
  dataTestId
}: AlertProps): JSX.Element 
{
  const [visible, setVisible] = useState<boolean>(children !== '');
  const context = useContext(AlertContext);

  useEffect(() => {
    /**
     * The Alert component should hide itself
     * after 3 seconds. The component will still
     * be mounted, but it will be given a className
     * that visually hides it from the user's view.
     */
    if (children) {
      setVisible(true);

      const hide = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return function () {
        clearTimeout(hide);
      }
    }
  }, [context]);

  return (
    <div 
      className={classNames(
        styles.alert,
        styles[`${Type}`],
        visible && styles.visible
      )}
      data-testid={dataTestId}
    >
      <div className={styles.alertMssg}>
        {children}
      </div>
    </div>
  );
}