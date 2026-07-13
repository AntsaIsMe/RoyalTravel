import Menu from "./Menu";

export function Header() {
    return (
        <div className="bg-primary p-5 border-b-secondary">
            <div className="flex items-center justify-between">
                <h1 className="text-text text-2xl">Royal<b className="text-secondary">Travel</b></h1>
                <Menu/>
            </div>
        </div>
    )
}