import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from './components/App'
import './styles/app.css'
import { BrowserRouter } from "react-router-dom";
const rootEl = document.querySelector("#root")



if (rootEl) {
    const root = ReactDOM.createRoot(rootEl)
    root.render(
        <StrictMode>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </StrictMode>
    )
    
}
else{
    console.log("root div not found");
    
}