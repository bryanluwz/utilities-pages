import { Component, Fragment, createRef } from "react";

export class UtilitiesPageImageConverter extends Component {
	constructor(props) {
		super(props);

		this.title = "Image Converter";
		this.description = "Convert images to different formats";

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();

		this.inputFile = null;
		this.inputFileName = null;

		this.outputFile = null;
		this.outputFileName = null;

		this.downloadLinkRef = createRef();
		this.imageOutputRef = createRef();
		this.imgDropZone = createRef();

		this.reader = null;

		this.state = {
			convertFileTypeSelectArrowIsRotated: false,
			isConverting: false,
			isConvertingAllowed: true,
			isError: false,
			pasteText: "Paste",
			isClipboardApiSupported: this.isClipboardApiSupported()
		};
	}

	componentDidMount() {
		this.imgDropZone.current.addEventListener("dragover", this.handleDragOver);
		this.imgDropZone.current.addEventListener("drop", this.handleDrop);
	}

	// I can cheese copy but not paste, so just disable for safari lol
	isClipboardApiSupported = () => {
		return !!navigator.clipboard && typeof navigator.clipboard.read === 'function';
	};

	handleDragOver = (event) => {
		event.preventDefault();
	};

	handleDrop = (event) => {
		event.preventDefault();
		var file = event.dataTransfer?.files[0];

		if (file) {
			this.inputFile = file;
			this.inputFileName = file.name;
			this.inputFileTypeRef.current.innerHTML = "Input: <b>" + this.inputFileName + "</b>";
			this.inputFileUrl = URL.createObjectURL(this.inputFile);
			this.forceUpdate();
		}
	};

	// I spent a lot of time making this animation you know
	waitForImageOutputTransitionEnd = () => {
		return new Promise((resolve) => {
			const handleTransitionEnd = () => {
				// Transition has ended, resolve the Promise
				this.imageOutputRef.current.removeEventListener('transitionend', handleTransitionEnd);
				this.setState({ isConvertingAllowed: true });
				resolve();
			};

			this.imageOutputRef.current.addEventListener('transitionend', handleTransitionEnd);
			this.setState({ isConvertingAllowed: false });
		});
	};

	handleConvertButtonClick = async () => {
		if (this.state.isConverting || !this.state.isConvertingAllowed || this.inputFile === null) {
			return;
		}

		this.setState({ isConvertingAllowed: false });

		if (this.outputFile) {
			this.imageOutputRef.current.style.height = "0px";
			await this.waitForImageOutputTransitionEnd();
			this.imageOutputRef.current.src = "";
		}

		this.setState({ isConverting: true, isError: false });

		if (!this.reader) {
			this.reader = new FileReader();

			this.reader.onload = (event) => {
				const img = new Image();
				img.src = event.target.result;
				img.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0);

					const outputFormat = document.querySelector('.ui-select select').value;

					this.outputFileName = this.inputFileName.split('.')[0] + `_${outputFormat}.${outputFormat}`;
					this.outputFile = canvas.toDataURL(`image/${outputFormat}`);

					this.imageOutputRef.current.src = this.outputFile;

					this.setState({ isConverting: false, isConvertingAllowed: true });
				};
			};

			this.reader.onerror = (event) => {
				this.setState({ isConverting: false, isError: true, isConvertingAllowed: true });
			};
		}

		this.reader.readAsDataURL(this.inputFile);
	};

	handleFileUpload = (event) => {
		let inputFileName = event.target?.files[0]?.name;
		inputFileName = inputFileName ? inputFileName : "None";
		this.inputFileName = inputFileName;
		this.inputFileTypeRef.current.innerHTML = "Input: " + inputFileName;
		this.inputFile = event.target.files[0];
	};


	handlePaste = () => {
		if (!this.state.isClipboardApiSupported) {
			this.setState({ pasteText: "Paste not supported on this device. SAD :(" },
				() => {
					setTimeout(() => {
						this.setState({ pasteText: "Do not paste 😠" });
					}, 2000);
				});
			return;
		}

		// Read image from clipboard
		navigator.clipboard.read()
			.then(clipboardItems => {
				clipboardItems.forEach(clipboardItem => {
					clipboardItem.types.forEach(type => {
						if (type.startsWith("image/")) {
							const imageFormat = type.substring(6);
							clipboardItem.getType(`image/${imageFormat}`).then(blob => {
								// Here, blob is the actual image data
								this.inputFile = blob;
								this.inputFileName = "Clipboard Image";
								this.inputFileTypeRef.current.innerHTML = "Input: <b>" + this.inputFileName + "</b>";
								this.inputFileUrl = URL.createObjectURL(this.inputFile);
								this.forceUpdate();
							});
						}
					});
				});
			}
			)
			.catch(err => {
				console.log(err);
			});
	};


	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					{this.title}
				</div>
				<div className="utils-description">
					{this.description}
				</div>
				<div className="ui-flex-column" ref={this.imgDropZone}>
					<div className="ui-flex-row">
						<label className="ui-file-input-wrapper">
							<div>Upload File</div>
							<input
								type="file"
								id="file-input"
								accept="image/*"
								onChange={this.handleFileUpload}
							/>
						</label>
						<div ref={this.inputFileTypeRef}>
							Input: None
						</div>
						<button className="ui-button" onClick={this.handlePaste}>
							{this.state.pasteText}
						</button>
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
								<option value="png">PNG</option>
								<option value="jpeg">JPEG</option>
								<option value="webp">WEBP</option>
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
						className={`ui-button ${this.state.isConverting || !this.state.isConvertingAllowed ? 'ui-button-disabled' : ''}`}
						id="convert-button"
						onClick={this.handleConvertButtonClick}
					>
						Convert
					</button>
					<div className="ui-extra-info" ref={this.extraInfoLabelRef}>
						{
							<Fragment>
								<a
									ref={this.downloadLinkRef}
									href={this.outputFile}
									download={this.outputFileName} >
									Download {this.outputFileName}
								</a>
								<img ref={this.imageOutputRef}
									style={{
										height: "0px"
									}}
									alt=""
									onLoad={
										() => {
											const width = this.imageOutputRef.current.width;
											const aspectRatio = this.imageOutputRef.current.naturalWidth / this.imageOutputRef.current.naturalHeight;
											const height = width / aspectRatio;
											this.imageOutputRef.current.style.height = height + "px";
										}}
									onTransitionEnd={() => {
										this.imageOutputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
									}
									}
								/>
								{
									this.state.isError &&
									"Error converting image"
								}
							</Fragment >
						}
					</div>
				</div>
			</div>
		);
	}
};

UtilitiesPageImageConverter.displayName = "Image Converter";
UtilitiesPageImageConverter.title = "Image Converter";
UtilitiesPageImageConverter.description = "Convert images to different formats";;