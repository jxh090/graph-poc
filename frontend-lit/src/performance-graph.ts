import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

@customElement("performance-graph")
export class PerformanceGraph extends LitElement {
    @property({ type: Array })
    private data: any[] = [];


    private svg: any;
    private width = 1280;
    private height = 800;
    private marginBottom = 30;

    constructor() {
        super();
        console.log(this.data)
    }

    connectedCallback() {
        super.connectedCallback();
        this.initializeGraph();
    }

    private initializeGraph() {
        const x = d3.scaleLinear().domain([0, 100]).range([0, this.width]);

        this.svg = d3
            .select(this)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        const gx = this.svg
            .append("g")
            .attr(
                "transform",
                `translate(0,${this.height - this.marginBottom})`,
            )
            .call(d3.axisBottom(x));
    }

    render() {
        return html`
            <p>${JSON.stringify(this.data)}</p>
            <slot></slot>
        `;
    }

    static styles = css`
    :host {
        display: block;
    }`;
}

declare global {
    interface HTMLElementTagNameMap {
        "performance-graph": PerformanceGraph;
    }
}
