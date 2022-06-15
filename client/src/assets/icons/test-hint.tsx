import React from 'react';
import { useTranslation } from 'react-i18next';

function TestHint(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
): JSX.Element {
  const { t } = useTranslation();

  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <title>{t('icons.test-hint')}</title>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d={
          'M9.99995 0C10.5522 0 10.9999 0.447715 10.9999 1V2C10.9999 2.55228 10.5522 '+
          '3 9.99995 3C9.44766 3 8.99995 2.55228 8.99995 2V1C8.99995 0.447715 9.44766 '+
          '0 9.99995 0ZM2.92888 2.92893C3.3194 2.53841 3.95257 2.53841 4.34309 '+
          '2.92893L5.0502 3.63604C5.44072 4.02656 5.44072 4.65973 5.0502 5.05025C4.65967 '+
          '5.44078 4.02651 5.44078 3.63599 5.05025L2.92888 4.34315C2.53835 3.95262 '+
          '2.53835 3.31946 2.92888 2.92893ZM17.071 2.92893C17.4615 3.31946 17.4615 '+
          '3.95262 17.071 4.34315L16.3639 5.05025C15.9734 5.44078 15.3402 5.44078 '+
          '14.9497 5.05025C14.5592 4.65973 14.5592 4.02656 14.9497 3.63604L15.6568 '+
          '2.92893C16.0473 2.53841 16.6805 2.53841 17.071 2.92893ZM7.17152 7.1716C5.60942 '+
          '8.73369 5.60942 11.2664 7.17152 12.8285L7.71862 13.3755C7.91165 13.5686 '+
          '8.08478 13.7778 8.23669 14H11.7632C11.9151 13.7778 12.0882 13.5686 12.2813 '+
          '13.3755L12.8284 12.8285C14.3905 11.2664 14.3905 8.73369 12.8284 7.1716C11.2663 '+
          '5.6095 8.73362 5.6095 7.17152 7.1716ZM13.2448 15.4187C13.3586 15.188 13.5101 '+
          '14.9751 13.6955 14.7898L14.2426 14.2427C16.5857 11.8995 16.5857 8.10053 '+
          '14.2426 5.75738C11.8994 3.41424 8.10045 3.41424 5.75731 5.75738C3.41416 '+
          '8.10053 3.41416 11.8995 5.75731 14.2427L6.3044 14.7898C6.48976 14.9751 '+
          '6.64131 15.188 6.75509 15.4187C6.76009 15.4295 6.76527 15.4403 6.77064 '+
          '15.4509C6.92021 15.7661 6.99995 16.1134 6.99995 16.469V17C6.99995 18.6569 '+
          '8.34309 20 9.99995 20C11.6568 20 12.9999 18.6569 12.9999 17V16.469C12.9999 '+
          '16.1134 13.0797 15.7661 13.2292 15.4509C13.2346 15.4403 13.2398 15.4295 '+
          '13.2448 15.4187ZM11.0251 16H8.97475C8.99146 16.155 8.99995 16.3116 8.99995 '+
          '16.469V17C8.99995 17.5523 9.44766 18 9.99995 18C10.5522 18 10.9999 17.5523 '+
          '10.9999 17V16.469C10.9999 16.3116 11.0084 16.155 11.0251 16ZM0 9.99995C0 '+
          '9.44766 0.447715 8.99995 1 8.99995H2C2.55228 8.99995 3 9.44766 3 9.99995C3 '+
          '10.5522 2.55228 10.9999 2 10.9999H1C0.447715 10.9999 0 10.5522 0 '+
          '9.99995ZM17 9.99995C17 9.44766 17.4477 8.99995 18 8.99995H19C19.5523 '+
          '8.99995 20 9.44766 20 9.99995C20 10.5522 19.5523 10.9999 19 '+
          '10.9999H18C17.4477 10.9999 17 10.5522 17 9.99995Z'
        }
        fill='#2A2A2A'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d={
          'M9.99995 0C10.5522 0 10.9999 0.447715 10.9999 1V2C10.9999 2.55228 10.5522 '+
          '3 9.99995 3C9.44766 3 8.99995 2.55228 8.99995 2V1C8.99995 0.447715 9.44766 '+
          '0 9.99995 0ZM2.92888 2.92893C3.3194 2.53841 3.95257 2.53841 4.34309 '+
          '2.92893L5.0502 3.63604C5.44072 4.02656 5.44072 4.65973 5.0502 5.05025C4.65967 '+
          '5.44078 4.02651 5.44078 3.63599 5.05025L2.92888 4.34315C2.53835 3.95262 '+
          '2.53835 3.31946 2.92888 2.92893ZM17.071 2.92893C17.4615 3.31946 17.4615 '+
          '3.95262 17.071 4.34315L16.3639 5.05025C15.9734 5.44078 15.3402 5.44078 '+
          '14.9497 5.05025C14.5592 4.65973 14.5592 4.02656 14.9497 3.63604L15.6568 '+
          '2.92893C16.0473 2.53841 16.6805 2.53841 17.071 2.92893ZM7.17152 '+
          '7.1716C5.60942 8.73369 5.60942 11.2664 7.17152 12.8285L7.71862 '+
          '13.3755C7.91165 13.5686 8.08478 13.7778 8.23669 14H11.7632C11.9151 '+
          '13.7778 12.0882 13.5686 12.2813 13.3755L12.8284 12.8285C14.3905 11.2664 '+
          '14.3905 8.73369 12.8284 7.1716C11.2663 5.6095 8.73362 5.6095 7.17152 '+
          '7.1716ZM13.2448 15.4187C13.3586 15.188 13.5101 14.9751 13.6955 '+
          '14.7898L14.2426 14.2427C16.5857 11.8995 16.5857 8.10053 14.2426 '+
          '5.75738C11.8994 3.41424 8.10045 3.41424 5.75731 5.75738C3.41416 8.10053 '+
          '3.41416 11.8995 5.75731 14.2427L6.3044 14.7898C6.48976 14.9751 6.64131 '+
          '15.188 6.75509 15.4187C6.76009 15.4295 6.76527 15.4403 6.77064 '+
          '15.4509C6.92021 15.7661 6.99995 16.1134 6.99995 16.469V17C6.99995 18.6569 '+
          '8.34309 20 9.99995 20C11.6568 20 12.9999 18.6569 12.9999 17V16.469C12.9999 '+
          '16.1134 13.0797 15.7661 13.2292 15.4509C13.2346 15.4403 13.2398 15.4295 '+
          '13.2448 15.4187ZM11.0251 16H8.97475C8.99146 16.155 8.99995 16.3116 8.99995 '+
          '16.469V17C8.99995 17.5523 9.44766 18 9.99995 18C10.5522 18 10.9999 17.5523 '+
          '10.9999 17V16.469C10.9999 16.3116 11.0084 16.155 11.0251 16ZM0 9.99995C0 '+
          '9.44766 0.447715 8.99995 1 8.99995H2C2.55228 8.99995 3 9.44766 3 9.99995C3 '+
          '10.5522 2.55228 10.9999 2 10.9999H1C0.447715 10.9999 0 10.5522 0 '+
          '9.99995ZM17 9.99995C17 9.44766 17.4477 8.99995 18 8.99995H19C19.5523 '+
          '8.99995 20 9.44766 20 9.99995C20 10.5522 19.5523 10.9999 19 '+
          '10.9999H18C17.4477 10.9999 17 10.5522 17 9.99995Z'
        }
        fill='#2A2A2A'
      />
    </svg>
  );
}

TestHint.displayName = 'TestHint';

export default TestHint;
