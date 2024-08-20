import gsap from "gsap";
import { References } from "./references";

export class CursorAnimations {
    public static cursorWhite = () => {
        References.cursorClasses._pins.map((pin, index) =>
            gsap.to(pin, { background: References.cursorClasses._whitePinBg[index] })
        );
    }

    public static cursorBlue = () => {
        References.cursorClasses._pins.map((pin, index) =>
            gsap.to(pin, { background: References.cursorClasses._bluePingBg[index] })
        );
    }
}