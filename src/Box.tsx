import { SyntheticEvent, useState, useEffect } from 'react';
import './Box.scss';

interface Point {
	x: number;
	y: number;
}

export default function Box(props: {
	horizontalDots: number;
	verticalDots: number;
	onSelectionsChange?: (points: Point[] | null) => void;
	className?: string;
}) {
	// if null, nothing is selected, if not null, element 0 and 1 are the opposing
	const [selections, setSelections] = useState<Point[] | null>(null);
	const [hoverPoint, setHoverPoint] = useState<Point | null>(null);
	const [mouseDown, setMouseDown] = useState<boolean>(false);

	const handleMouseDown = ({
		e,
		x,
		y,
	}: {
		e: SyntheticEvent;
		x: number;
		y: number;
	}) => {
		e.persist();
		setMouseDown(true);
		setSelections([{ x, y }]);
	};

	const handleMouseUp = ({
		e,
		x,
		y,
	}: {
		e: SyntheticEvent;
		x: number;
		y: number;
	}) => {
		e.persist();
		setMouseDown(false);
		const newPoint = { x, y };
		const validRectangle = (otherPoint: Point) =>
			Math.abs(otherPoint.x - x) > 0 && Math.abs(otherPoint.y - y) > 0;
		setSelections((p) =>
			Array.isArray(p) && validRectangle(p[0]) ? [...p, newPoint] : null
		);
	};
	const handleMouseOver = ({ x, y }: { x: number; y: number }) => {
		if (Array.isArray(selections) && selections.length === 1) {
			setHoverPoint({ x, y });
		} else {
			if (hoverPoint !== null) {
				setHoverPoint(null);
			}
		}
	};

	// listener
	useEffect(() => {
		if (
			!!props.onSelectionsChange &&
			Array.isArray(selections) &&
			selections.length == 2
		) {
			props.onSelectionsChange(selections);
		}
	}, [selections, props]);

	// connector lines
	const shouldHaveLeftCon = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 2 &&
		(selections[0].y === y || selections[1].y === y) &&
		((selections[0].y >= y && selections[1].y <= y) ||
			(selections[0].y <= y && selections[1].y >= y)) &&
		((selections[0].x >= x && selections[1].x < x) ||
			(selections[0].x < x && selections[1].x >= x));

	const shouldHaveRightCon = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 2 &&
		(selections[0].y === y || selections[1].y === y) &&
		((selections[0].y >= y && selections[1].y <= y) ||
			(selections[0].y <= y && selections[1].y >= y)) &&
		((selections[0].x <= x && selections[1].x > x) ||
			(selections[0].x > x && selections[1].x <= x));

	const shouldHaveTopCon = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 2 &&
		(selections[0].x === x || selections[1].x === x) &&
		((selections[0].y >= y && selections[1].y < y) ||
			(selections[0].y < y && selections[1].y >= y)) &&
		((selections[0].x <= x && selections[1].x >= x) ||
			(selections[0].x >= x && selections[1].x <= x));

	const shouldHaveBottomCon = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 2 &&
		(selections[0].x === x || selections[1].x === x) &&
		((selections[0].y <= y && selections[1].y > y) ||
			(selections[0].y > y && selections[1].y <= y)) &&
		((selections[0].x <= x && selections[1].x >= x) ||
			(selections[0].x >= x && selections[1].x <= x));

	// helper lines

	const shouldHaveLeftHover = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 1 &&
		hoverPoint !== null &&
		(selections[0].y === y || hoverPoint.y === y) &&
		((selections[0].y >= y && hoverPoint.y <= y) ||
			(selections[0].y <= y && hoverPoint.y >= y)) &&
		((selections[0].x >= x && hoverPoint.x < x) ||
			(selections[0].x < x && hoverPoint.x >= x));

	const shouldHaveRightHover = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 1 &&
		hoverPoint !== null &&
		(selections[0].y === y || hoverPoint.y === y) &&
		((selections[0].y >= y && hoverPoint.y <= y) ||
			(selections[0].y <= y && hoverPoint.y >= y)) &&
		((selections[0].x <= x && hoverPoint.x > x) ||
			(selections[0].x > x && hoverPoint.x <= x));

	const shouldHaveTopHover = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 1 &&
		hoverPoint !== null &&
		(selections[0].x === x || hoverPoint.x === x) &&
		((selections[0].y >= y && hoverPoint.y < y) ||
			(selections[0].y < y && hoverPoint.y >= y)) &&
		((selections[0].x <= x && hoverPoint.x >= x) ||
			(selections[0].x >= x && hoverPoint.x <= x));

	const shouldHaveBottomHover = (x: number, y: number) =>
		Array.isArray(selections) &&
		selections.length === 1 &&
		hoverPoint !== null &&
		(selections[0].x === x || hoverPoint.x === x) &&
		((selections[0].y <= y && hoverPoint.y > y) ||
			(selections[0].y > y && hoverPoint.y <= y)) &&
		((selections[0].x <= x && hoverPoint.x >= x) ||
			(selections[0].x >= x && hoverPoint.x <= x));

	return (
		<div
			className={['dots-wrapper', props.className ?? ''].join(' ')}
			style={{
				gridTemplateColumns: `repeat(${props.horizontalDots},1fr)`,
				gridTemplateRows: `repeat(${props.verticalDots},1fr)`,
			}}
		>
			{Array.from(Array(props.verticalDots * props.horizontalDots)).map(
				(_, i) => {
					const x = i % props.horizontalDots;
					const y = Math.floor(i / props.horizontalDots);
					return (
						<div
							key={i}
							className="dot"
							draggable={false}
							onMouseDown={(e) =>
								handleMouseDown({
									e: e,
									x,
									y,
								})
							}
							onMouseUp={(e) =>
								handleMouseUp({
									e: e,
									x,
									y,
								})
							}
							onMouseOver={() => handleMouseOver({ x, y })}
						>
							<span
								draggable={false}
								className={
									Array.isArray(selections) &&
									selections.length === 1 &&
									selections[0].x === x &&
									selections[0].y === y
										? 'dot-selected'
										: undefined
								}
							/>
							{[
								shouldHaveRightCon(x, y) ? (
									<div key={`${i}-right`} className="right-con" />
								) : null,
								shouldHaveLeftCon(x, y) ? (
									<div key={`${i}-left`} className="left-con" />
								) : null,
								shouldHaveTopCon(x, y) ? (
									<div key={`${i}-top`} className="top-con" />
								) : null,
								shouldHaveBottomCon(x, y) ? (
									<div key={`${i}-bottom`} className="bottom-con" />
								) : null,
								shouldHaveRightHover(x, y) ? (
									<div
										key={`${i}-right-hover`}
										className="right-con con-hover"
									/>
								) : null,
								shouldHaveLeftHover(x, y) ? (
									<div key={`${i}-left-hover`} className="left-con con-hover" />
								) : null,
								shouldHaveTopHover(x, y) ? (
									<div key={`${i}-top-hover`} className="top-con con-hover" />
								) : null,
								shouldHaveBottomHover(x, y) ? (
									<div
										key={`${i}-bottom-hover`}
										className="bottom-con con-hover"
									/>
								) : null,
							]}
						</div>
					);
				}
			)}
		</div>
	);
}
