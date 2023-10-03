import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';
import { ConfigProvider } from 'antd';
import { UserProvider } from '~/context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <GlobalStyles>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#007a3a',
                        borderRadius: '2px',
                    },
                    components: {
                        Button: {
                            fontWeight: 700,
                            primaryShadow: 'none',
                        },
                        Tabs: {
                            itemSelectedColor: 'rgba(22, 24, 35, 0.6)',
                            itemHoverColor: 'rgba(22, 24, 35, 0.6)',
                            itemColor: 'rgba(22, 24, 35, 0.6)',
                            itemActiveColor: 'rgba(22, 24, 35, 0.6)',
                            inkBarColor: '#000',
                            horizontalItemGutter: '60',
                            horizontalItemPadding: '12px 40px',
                            titleFontSize: '16px',
                        },
                    },
                }}
            >
                <App />
            </ConfigProvider>
        </GlobalStyles>
    </UserProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
