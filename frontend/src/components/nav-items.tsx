interface NavProps {
    link: string;
    item: string;
    onClick?: () => void;
    target?: string;
    rel?: string;
}

function nav(props: NavProps) {
    return (
        <li className="tabletmax:my-8 tabletmax:mx-6">
            <a className="text-gray-500 hover:text-black transition-all" target={props.target} rel={props.rel}  href={props.link}>{props.item}</a>
        </li>
    )
}

export default nav