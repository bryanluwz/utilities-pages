import { Component, createRef } from "react";

export default class UtilitiesPageBox extends Component {
	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					{this.props.title}
				</div>
				<div className="utils-description">
					{this.props.description}
				</div>
				{
					this.props.ui.map((ui, index) => {
						const TagName = ui.tag.toLowerCase();

						if (TagName === "div") {
							return (
								<div className="ui-div">
									{ui.content}
								</div>
							);
						}
						else if (TagName === "button") {
							return (
								<button
									className="ui-button"
									onClick={this.props.onButtonClick}
									key={index}
								>
									{ui.content}
								</button>
							);
						}
					})
				}
			</div>
		);
	}
}

export class UtilitiesPageFfmpegConversion extends Component {
	constructor(props) {
		super(props);

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();

		this.state = {
			convertFileTypeSelectArrowIsRotated: false
		};
	}

	handleConvertButtonClick = async () => {
		this.extraInfoLabelRef.current.innerHTML = "Converting...";
		setTimeout(() => {
			this.extraInfoLabelRef.current.innerHTML = "Done!";
			setTimeout(() => {
				this.extraInfoLabelRef.current.innerHTML = "";
			}
				, 1000);
		}
			, 1000);
	};

	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					FFMPEG Conversion
				</div>
				<div className="utils-description">
					Convert between different file formats using ffmpeg
				</div>
				<div className="ui-flex-column">
					<div className="ui-flex-row">
						<label className="ui-file-input-wrapper">
							<div>Upload File</div>
							<input
								type="file"
								id="file-input"
								onChange={(event) => {
									this.inputFileTypeRef.current.innerHTML = "Input: " + event.target.files[0].name;
								}}
							/>
						</label>
						<div ref={this.inputFileTypeRef}>
							Input: None
						</div>
					</div>
					<div className="ui-flex-row">
						<div>Convert to:</div>
						<div className="ui-select">
							<select
								onClick={() => {
									this.setState({ convertFileTypeSelectArrowIsRotated: !this.state.convertFileTypeSelectArrowIsRotated });
								}}
								onBlur={() => {
									this.setState({ convertFileTypeSelectArrowIsRotated: false });
								}}
							>
								<option value="mp4">mp4</option>
								<option value="mp3">mp3</option>
								<option value="wav">wav</option>
								<option value="ogg">ogg</option>
								<option value="webm">webm</option>
								<option value="mkv">mkv</option>
								<option value="mov">mov</option>
								<option value="flv">flv</option>
								<option value="avi">avi</option>
								<option value="wmv">wmv</option>
								<option value="m4a">m4a</option>
								<option value="aac">aac</option>
								<option value="ac3">ac3</option>
								<option value="flac">flac</option>
								<option value="alac">alac</option>
								<option value="wma">wma</option>
								<option value="m4v">m4v</option>
							</select>
							<div className="ui-select-arrow">
								<i
									style={{ transform: this.state.convertFileTypeSelectArrowIsRotated ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(360deg)' }}
									className="fa fa-caret-down"
								/>
							</div>
						</div>

					</div>
					<button
						className="ui-button"
						id="convert-button"
						onClick={this.handleConvertButtonClick}
					>
						Convert and Download
					</button>
					<div className="ui-extra-info" ref={this.extraInfoLabelRef}>

					</div>
				</div>
			</div>
		);
	}
}