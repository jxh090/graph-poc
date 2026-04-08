import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
`;
export const FlexBox = styled.div<{
    $center?: boolean;
    gap?: number;
    wrap?: boolean;
    direction?: "row" | "column";
}>`
    display: flex;
    flex-direction: ${(props) => (props.direction ? props.direction : "row")};
    gap: ${(props) => (props.gap ? `${props.gap}px` : "20px")};
    flex-wrap: ${(props) => (props.wrap ? "wrap" : "nowrap")};
    justify-content: ${(props) => (props.$center ? "center" : "flex-start")};
`;

export const Section = styled.div`
    margin-bottom: 22px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
`;

export const SectionTitle = styled.h3`
    margin-bottom: 10px;
    color: #2f2d2e;
    font-weight: 600;
`;

export const ButtonGroup = styled.div`
    display: flex;
    background-color: #ded9cf;
    overflow-x: auto;
    border-radius: 999px;
    padding: 8px;
    gap: 6px;
`;

export const Button = styled.button<{
    $isActive: boolean;
    $activeColor?: string;
}>`
    padding: 10px 18px;
    color: ${(props) => (props.$isActive ? "#fff" : "#2f2d2e")};
    background-color: ${(props) =>
        props.$isActive ? props.$activeColor || "#242124" : "transparent"};
    cursor: pointer;
    font-weight: 700;
    border-radius: 100px;
    transition: all 0.2s ease;
    border: none;
    position: relative;
    min-width: 84px;
    font-size: 18px;
    line-height: 1;
`;

export const ChartButtonGroup = styled.div`
    display: flex;
    gap: 6px;
    border-radius: 999px;
    background-color: #ded9cf;
    padding: 8px;
    overflow-x: auto;
`;

export const ChartButton = styled.button<{
    $isActive: boolean;
    $activeColor?: string;
}>`
    padding: 10px 16px;
    color: ${(props) => (props.$isActive ? "#fff" : "#2f2d2e")};
    background-color: ${(props) => (props.$isActive ? "#242124" : "transparent")};
    cursor: pointer;
    font-weight: ${(props) => (props.$isActive ? "700" : "600")};
    border-radius: 999px;
    transition: all 0.2s ease;
    border: none;
    position: relative;
    white-space: nowrap;

    &:hover {
        background-color: ${(props) => (props.$isActive ? "#242124" : "#d4cfc4")};
    }

    &:focus {
        outline: none;
    }
`;

export const ChartCard = styled.div`
    border-radius: 24px;
    background: #ecebeb;
    padding: 26px 20px;
    border: 16px solid #ddd7cc;
    @media screen and (min-width: 1024px) {
        padding: 30px 28px;
    }
`;

export const ChartHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 16px;
    margin-top: 18px;
`;

export const AccountLabel = styled.label`
    display: block;
    color: #2f2d2e;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    @media screen and (max-width: 1023px) {
        font-size: 28px;
    }
`;

export const AccountSelect = styled.select`
    width: min(420px, 100%);
    border: 1px solid #c3c2c2;
    background: #ecebeb;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 20px;
    color: #2f2d2e;
    font-weight: 500;
    @media screen and (max-width: 1023px) {
        font-size: 18px;
    }
`;

export const ToggleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    gap: 26px 40px;
    @media screen and (max-width: 1023px) {
        grid-template-columns: 1fr;
    }
`;

export const ToggleLabel = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 18px;
    color: #2f2d2e;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;

    input {
        display: none;
    }
`;

export const ToggleTrack = styled.span<{ $checked: boolean; $color: string }>`
    width: 48px;
    height: 24px;
    border-radius: 999px;
    background: ${(props) =>
        props.$checked
            ? `color-mix(in srgb, ${props.$color} 92%, white)`
            : `color-mix(in srgb, ${props.$color} 34%, white)`};
    position: relative;
    transition: all 0.2s ease;

    &::after {
        content: "";
        position: absolute;
        top: 2px;
        left: ${(props) => (props.$checked ? "26px" : "2px")};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #efefef;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
        transition: left 0.2s ease;
    }
`;

export const ChartWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

