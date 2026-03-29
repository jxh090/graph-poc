import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("graph-spa")
export class GraphSpa extends LitElement {
    @state()
    private chartData: object[] = [];
    connectedCallback() {
        super.connectedCallback();
        fetch('http://localhost:3000/chartData.json')
            .then(response => response.json())
            .then(data => {
                this.chartData = data;
            });
    }

    render() {
        return html`<performance-graph .data=${this.chartData}></performance-graph> `;
    }

    static styles = css`
        :host {
            display: block;
            margin: auto;
            max-width: 1280px;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "graph-spa": GraphSpa;
    }
}
