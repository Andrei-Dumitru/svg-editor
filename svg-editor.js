let buttonColor = '#f1f1f1', selectedButtonColor = 'gray';
let rect_elem, line_elem, ellipse_elem;
let editor, desen, selectie = line_elem;
let selectedShape = 'line', colorPicker, selectedColor = '#000000', widthPicker, selectedWidth = 2, bgColorPicker;
let mx = 0, my = 0, sx = 0, sy = 0;
let elementSelectat = null;
let isDragging = false;
let offsetX, offsetY;

function setareCoordonate(elem, x1, y1, x2, y2) {
    let pozx = Math.min(x1, x2);
    let pozy = Math.min(y1, y2);
    let width = Math.max(x1, x2) - Math.min(x1, x2);
    let height = Math.max(y1, y2) - Math.min(y1, y2);

    elem.removeAttribute('x1');
    elem.removeAttribute('y1');
    elem.removeAttribute('x2');
    elem.removeAttribute('y2');

    elem.removeAttribute('x');
    elem.removeAttribute('y');
    elem.removeAttribute('width');
    elem.removeAttribute('height');

    elem.removeAttribute('cx');
    elem.removeAttribute('cy');
    elem.removeAttribute('rx');
    elem.removeAttribute('ry');

    switch (selectedShape) {
        case 'line':
            elem.setAttribute('x1', sx);
            elem.setAttribute('y1', sy);
            elem.setAttribute('x2', mx);
            elem.setAttribute('y2', my);
            break;
        case 'rect':
            elem.setAttribute('x', pozx);
            elem.setAttribute('y', pozy);
            elem.setAttribute('width', width);
            elem.setAttribute('height', height);
            break;
        case 'ellipse':
            elem.setAttribute('cx', (x1 + x2) / 2);
            elem.setAttribute('cy', (y1 + y2) / 2);
            elem.setAttribute('rx', width / 2);
            elem.setAttribute('ry', height / 2);
            break;
        default:
    }

}

function deseneazaLinie(e) {
    selectie.style.display = 'none';
    let linie = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    setareCoordonate(linie, mx, my, sx, sy);
    linie.style.setProperty('stroke', selectedColor);
    linie.style.setProperty('stroke-width', selectedWidth);
    desen.append(linie);

    linie.addEventListener('contextmenu', e => {
        e.preventDefault();
        elementSelectat = linie;
        [...desen.querySelectorAll('line, rect, ellipse')].forEach(
            d => d.classList.remove('selectat')
        );
        elementSelectat.classList.add('selectat');
    });
}

function deseneazaDreptunghi(e) {
    selectie.style.display = 'none';

    let dreptunghi = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    setareCoordonate(dreptunghi, mx, my, sx, sy);
    desen.append(dreptunghi);

    dreptunghi.addEventListener('contextmenu', e => {
        e.preventDefault();
        elementSelectat = dreptunghi;
        [...desen.querySelectorAll('line, rect, ellipse')].forEach(
            d => d.classList.remove('selectat')
        );
        elementSelectat.classList.add('selectat');
    });
}

function deseneazaElipsa(e) {
    selectie.style.display = 'none';
    let elipsa = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    setareCoordonate(elipsa, mx, my, sx, sy);
    desen.append(elipsa);

    elipsa.addEventListener('contextmenu', e => {
        e.preventDefault();
        elementSelectat = elipsa;
        [...desen.querySelectorAll('line, rect, ellipse')].forEach(
            d => d.classList.remove('selectat')
        );
        elementSelectat.classList.add('selectat');
    });
}

function mousemove(e) {
    mx = e.x - editor.getBoundingClientRect().x;
    my = e.y - editor.getBoundingClientRect().y;
    if (elementSelectat === null) {
        setareCoordonate(selectie, mx, my, sx, sy);
    } else {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            switch (elementSelectat.tagName) {
                case 'line':
                    const dx = x - sx;
                    const dy = y - sy;
                    elementSelectat.setAttribute('x1', parseFloat(elementSelectat.getAttribute('x1')) + dx);
                    elementSelectat.setAttribute('y1', parseFloat(elementSelectat.getAttribute('y1')) + dy);
                    elementSelectat.setAttribute('x2', parseFloat(elementSelectat.getAttribute('x2')) + dx);
                    elementSelectat.setAttribute('y2', parseFloat(elementSelectat.getAttribute('y2')) + dy);
                    sx = x;
                    sy = y;
                    break;
                case 'rect':
                    elementSelectat.setAttribute('x', x);
                    elementSelectat.setAttribute('y', y);
                    break;
                case 'ellipse':
                    elementSelectat.setAttribute('cx', x);
                    elementSelectat.setAttribute('cy', y);
                    break;
                default:
            }
        }
    }
}

function mousedown(e) {
    if (elementSelectat === null) {
        selectie.style.display = 'block';
        sx = mx; sy = my;
        setareCoordonate(selectie, mx, my, sx, sy);
    } else {
        isDragging = true;
        offsetX = e.clientX - elementSelectat.getBoundingClientRect().left;
        offsetY = e.clientY - elementSelectat.getBoundingClientRect().top;
        sx = mx; sy = my;
    }

}

function mouseup(e) {
    if (elementSelectat === null && isDragging === false) {
        switch (selectedShape) {
            case 'line':
                deseneazaLinie(e);
                break;
            case 'rect':
                deseneazaDreptunghi(e);
                break;
            case 'ellipse':
                deseneazaElipsa(e);
                break;
            default:
        }
    } else {
        isDragging = false;
        sx = mx; sy = my;
    }
}

function lineButtonPress(e) {
    selectie = line_elem;
    selectedShape = 'line';
    btnLine.style.backgroundColor = selectedButtonColor;
    btnRect.style.backgroundColor = buttonColor;
    btnEllipse.style.backgroundColor = buttonColor;
}

function rectButtonPress(e) {
    selectie = rect_elem;
    selectedShape = 'rect';
    btnLine.style.backgroundColor = buttonColor;
    btnRect.style.backgroundColor = selectedButtonColor;
    btnEllipse.style.backgroundColor = buttonColor;
}

function ellipseButtonPress(e) {
    selectie = ellipse_elem;
    selectedShape = 'ellipse';
    btnLine.style.backgroundColor = buttonColor;
    btnRect.style.backgroundColor = buttonColor;
    btnEllipse.style.backgroundColor = selectedButtonColor;
}

function setColor(e) {
    selectedColor = colorPicker.value;
    if (elementSelectat != null && elementSelectat.tagName === 'line') {
        elementSelectat.style.setProperty('stroke', selectedColor);
    }
    line_elem.style.setProperty('stroke', selectedColor);
}

function setWidth(e) {
    selectedWidth = widthPicker.value;
    if (elementSelectat != null && elementSelectat.tagName === 'line') {
        elementSelectat.style.setProperty('stroke-width', selectedWidth);
    }
    line_elem.style.setProperty('stroke-width', selectedWidth);
}

function setBgColor(e) {
    editor.style.backgroundColor = bgColorPicker.value;
}

function deleteSelectedElement(e) {
    if (elementSelectat && e.key === "Delete") {
        elementSelectat.remove();
        elementSelectat = null;
        isDragging = false;
        mouseup(e);
    }
}

function deselectAllElements() {
    [...desen.querySelectorAll('rect, ellipse, line')].forEach(
        d => d.classList.remove('selectat')
    );
    elementSelectat = null;
}

function canvasClick(e) {
    if (e.target === editor) {
        deselectAllElements();
    }
}

// function isOnElement(e) {
//     const mouseX = e.clientX;
//     const mouseY = e.clientY;

//     if (elementSelectat) {
//         const elementRect = elementSelectat.getBoundingClientRect();
//         return (
//             mouseX >= elementRect.left &&
//             mouseX <= elementRect.right &&
//             mouseY >= elementRect.top &&
//             mouseY <= elementRect.bottom
//         );
//     }

//     return false;
// }

function aplicatie() {
    editor = document.querySelector('#editor');
    desen = document.querySelector('#desen');
    rect_elem = document.querySelector('#rect_elem');
    selectie = line_elem = document.querySelector('#line_elem');
    ellipse_elem = document.querySelector('#ellipse_elem');
    btnLine = document.querySelector('#btnLine');
    btnRect = document.querySelector('#btnRect');
    btnEllipse = document.querySelector('#btnEllipse');
    colorPicker = document.querySelector('#colorpicker');
    widthPicker = document.querySelector('#widthpicker');
    bgColorPicker = document.querySelector('#bgcolorpicker');

    btnLine.addEventListener('click', lineButtonPress);
    btnRect.addEventListener('click', rectButtonPress);
    btnEllipse.addEventListener('click', ellipseButtonPress);
    colorPicker.addEventListener('input', setColor, false);
    widthPicker.addEventListener('input', setWidth, false);
    bgColorPicker.addEventListener('input', setBgColor, false);

    editor.addEventListener('mousemove', mousemove);
    editor.addEventListener('mousedown', mousedown);
    editor.addEventListener('mouseup', mouseup);
    document.addEventListener('keydown', deleteSelectedElement);
    editor.addEventListener('click', canvasClick);

}
document.addEventListener('DOMContentLoaded', aplicatie);