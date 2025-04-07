import { ChevronRight } from "lucide-react";

interface NavProps {
    link: string;
    item: string;
    onClick?: () => void;
    target?: string;
    rel?: string;
}

function nav(props: NavProps) {
    return (
        <li className="tabletmax:py-4 tabletmax:mt-3 tabletmax:mx-3 tabletmax:px-6 tabletmax:dark:hover:bg-accent tabletmax:hover:bg-red-50 flex items-center justify-between transition-all duration-300 tabletmax:rounded-lg">
            <a className="text-gray-500 hover:text-black dark:text-textdark hover:dark:text-gray-400 transition-all" target={props.target} rel={props.rel} href={props.link}>{props.item}</a>
            <ChevronRight className="block tablet:hidden text-gray-500 hover:bg-black dark:text-textdark hover:dark:text-gray-400 transition-all" />
        </li>

    )
}

export default nav