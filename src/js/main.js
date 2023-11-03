import * as d3 from "d3";
const main = document.querySelector("main");
const aside = document.querySelector("aside");
const viz = document.querySelector("#viz");
const dialog = document.querySelector("dialog");
import anime from "animejs/lib/anime.es.js";

const activateModal = (content) => {
  const div = dialog.querySelector("#content");
  div.innerHTML = "";
  div.insertAdjacentHTML("beforeend", content);
  dialog.showModal();
  return true;
};

class CircleChart {
  /*   get arcGenerator() {
    const { radii } = this;
    return d3
      .arc()
      .innerRadius((_, i) => radii[i])
      .outerRadius((_, i) => radii[i] + 1)
      .startAngle(-Math.PI)
      .endAngle(Math.PI);
  } */

  arcGenerator2(cx, cy, r) {
    console.log(r);
    /*     return `M ${cx} ${cy} 
     m ${-1 * r}, 0
     a ${r}, ${r} 0 1,1 ${r * 2},0
     a ${r}, ${r} -90 1,1 ${r * -2},0`; */

    return;
  }

  get color() {
    return d3.quantize(d3.interpolateHcl("#60c96e", "#4d4193"), this.data.length);
  }

  get radius() {
    const { data, dimensions } = this;
    const { width } = dimensions;
    const radius = width / (data.length * 2 + 1);
    return radius;
  }

  get radii() {
    const max = this.dimensions.width / 2;
    const range = d3.range(this.radius, max, this.radius);
    return range.reverse();
  }

  get svg() {
    return d3.select("svg");
  }

  get dimensions() {
    return {
      width: viz.clientWidth,
      height: viz.clientHeight
    };
  }
  setData(data) {
    if (this.animating) {
      return false;
    }
    this.data = data.slice().reverse();
    this._redraw();
  }

  _reset() {}

  animate(reverse = false) {
    const strokeDashoffset = {
      value: [
        0,
        (el) => {
          console.log(el);
          const pathLength = parseFloat(el.getAttribute("data-r")) * Math.PI * 2;
          el.setAttribute("stroke-dasharray", pathLength);
          return pathLength;
        }
      ]
      //duration: this.data.length * 10000,
    };
    const opacity = {
      value: [1, 0]
    };
    if (reverse) {
      strokeDashoffset.value.reverse();
      opacity.value.reverse();
    }
    return anime
      .timeline({
        easing: "cubicBezier(.28,.94,1,.99)",
        loop: false
      })
      .add({
        targets: "path",
        opacity: {
          value: reverse ? [0.3, 1] : [1, 0.3]
        },
        strokeDashoffset
      })
      .add(
        {
          targets: "text",
          opacity,
          duration: this.data.length * 20
        },
        100
      );
  }

  addLabels(g) {
    const { data } = this;
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      //.attr("x", 5) //Move the text from the start angle of the arc
      //.attr("dy", 18) //Move the text down
      .append("textPath")
      .attr("startOffset", "25%") // This is still not gr8
      .style("text-anchor", "middle")
      .attr("xlink:href", (_, idx) => `#cat_${idx}`)
      .text((data) => {
        const { items, collections, title } = data;
        const getSum = (array) => {
          return array.reduce((sum, num) => {
            return sum + num;
          }, 0);
        };
        const totalItems = (collection, i = 0) => {
          const itemCount = collection.items.length;
          const collectionCount = getSum(collection.collections.map(totalItems));
          return i + itemCount + collectionCount;
        };
        return `${title} (c: ${collections.length}; i: ${items.length}; ti: ${totalItems(data)})`;
      });
  }

  async _redraw() {
    this._reset();
    const _ = this;
    const { svg, dimensions, radius, radii, color, data } = _;
    const { height, width } = dimensions;
    const children = svg.selectAll("*");
    if (!children.empty()) {
      const animation = this.animate(false);
      await animation.finished;
      children.remove();
    }
    // Update hieght width viewbox
    svg.attr("height", height).attr("width", width).attr("viewBox", `0 0 ${height} ${width}`);
    const g = this.svg.append("g");
    // Create the rings
    const rings = g.selectAll("path").data(data);

    // And create paths from bound data
    rings
      .enter()
      .append("path")
      .attr("stroke", (_, idx) => color[idx])
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", () => {
        return radius;
      })
      .attr("fill", "none")
      .attr("id", (_, idx) => `cat_${idx}`)
      .attr("data-r", (_, idx) => radii[idx])
      // This is where we're drawing a circle path
      .attr("d", (_, idx) => {
        const r = radii[idx];
        return `M 0 0
        m ${-1 * r}, 0
        a ${r}, ${r} 0 0, 1 ${r * 2},0
        a ${r}, ${r} 0 0, 1 ${r * -2},0
        `;
      })
      .on("click", function (e, d) {
        if (d.collections.length > 0) {
          _.setData(d.collections);
        } else {
          import("./bibliography.js").then(({ default: Bibliography }) => {
            console.log(Bibliography);
            const bibliography = new Bibliography().setData(d.items);
            return activateModal(bibliography.getBibliography());
          });
        }
      })
      .on("mouseover", function (...args) {
        d3.select(this).attr("stroke-opacity", 0.5);
      })
      .on("mouseout", function (...args) {
        d3.select(this).attr("stroke-opacity", 0.3);
      });

    // Create labels for the arcs
    this.addLabels(g);

    // Create a zoom handler
    const zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [height, width]
      ])
      .scaleExtent([0.1, 8])
      .on("zoom", ({ transform }) => {
        return g.attr("transform", transform);
      });
    // And put it on the zoom thing
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);
    svg.call(zoom.translateBy, height / 2, width / 2);
    this.animating = true;
    await this.animate(true).finished;
    this.animating = false;
  }
}

const chart = new CircleChart();

(function () {
  fetch("./data/library.json")
    .then((response) => response.json())
    .then((data) => {
      updateAside(data);
      chart.setData(data);
    });
})();

function updateAside(data) {
  const ul = document.createElement("ul");
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.innerHTML = "Library";
  a.addEventListener("click", (e) => {
    chart.setData(data);
  });
  li.appendChild(a);
  ul.appendChild(li);
  listCollections(data, li);
  aside.appendChild(ul);
}

function listCollections(data, el) {
  const ul = document.createElement("ul");
  data.forEach((collection) => {
    const { title, collections } = collection;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerText = title;
    li.appendChild(a);
    if (collections.length > 0) {
      a.addEventListener("click", (e) => {
        chart.setData(collections);
      });
      listCollections(collections, li);
    }
    ul.appendChild(li);
  });
  el.appendChild(ul);
  return ul;
}
