import styled from "styled-components";

export const Container = styled.div``;
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
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ChartSection = styled.div`
    margin-bottom: 40px;
`;

export const SectionTitle = styled.h3`
    margin-bottom: 10px;
    color: #2c3e50;
    font-weight: 600;
`;

export const ButtonGroup = styled.div`
    display: flex;
    background-color: #d7dadc;
    overflow-x: auto;
    border-radius: 24px;
    @media screen and (min-width: 1024px) {
        border-radius: 100px;
        justify-content: center;
        gap: 10px;
        padding: 8px 12px;
        flex-wrap: wrap;
    }
`;

export const Button = styled.button<{
    $isActive: boolean;
    $activeColor?: string;
}>`
    padding: 12px 16px;
    color: ${(props) => (props.$isActive ? "#fff" : "var(--secondary-color)")};
    background-color: ${(props) =>
        props.$isActive
            ? props.$activeColor || "var(--secondary-color)"
            : "transparent"};
    cursor: pointer;
    font-weight: 700;
    border-radius: 100px;
    transition: all 0.2s ease;
    border: none;
    position: relative;
    min-width: 180px;
    font-size: 24px;
`;

export const ChartButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    border-radius: 24px;
    padding-bottom: 24px;
    overflow-x: auto;
    @media screen and (min-width: 1024px) {
        
    }
`;

export const ChartButton = styled.button<{
    $isActive: boolean;
    $activeColor?: string;
}>`
    padding: 8px 16px;
    color: ${(props) =>
        props.$isActive ? "var(--secondary-color)" : "#2c3e50"};
    cursor: pointer;
    font-weight: ${(props) => (props.$isActive ? "600" : "normal")};
    border-radius: 0;
    transition: all 0.2s ease;
    border: none;
    position: relative;

    &::after {
        content: "";
        display: block;
        height: 2px;
        background-color: ${(props) =>
            props.$isActive ? "var(--secondary-color)" : "transparent"};
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        &:hover {
            background-color: #fff;
        }
    }

    &:hover {
        background-color: ${(props) =>
            props.$isActive ? "inherit" : "#f6f8f8"};
        border: none;
    }

    &:focus {
        outline: none;
    }

    &:active {
        transform: translateY(0);
    }
`;

export const ChartCard = styled.div`
    border-radius: 12px;
`;

export const ChartHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 16px;
`;

export const CheckboxGroup = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.2s ease;
    color: #495057;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: var(--primary-color);
    }

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: var(--primary-color);
        flex-shrink: 0;
    }
`;

export const ChartWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export const TableRow = styled.div`
    border: 1px solid #2c3e50;
    border-radius: 8px;
    padding: 24px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    h4 {
        margin: 0;
    }
`;

export const AccordionRow = styled.div`
    border: 1px solid #2c3e50;
    border-radius: 8px;
    padding: 16px 24px;
    display: flex;
`;
