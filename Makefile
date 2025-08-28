# Makefile for Web Local Tools Chrome Extension

# 設定
SRC_DIR = src
DIST_DIR = dist
TEMP_DIR = .temp_build
VERSION = $(shell jq -r '.version' $(SRC_DIR)/manifest.json)
ZIP_NAME = web-local-tools-v$(VERSION).zip
CHROME_EXT_ZIP = chrome-extension.zip

# 含めるファイルとディレクトリ（srcディレクトリ内）
INCLUDE_FILES = manifest.json *.html *.css
INCLUDE_DIRS = js css images

# 除外するファイルとディレクトリ
EXCLUDE_PATTERNS = build.sh Makefile .git .gitignore README.md CLAUDE.md *.zip $(DIST_DIR) $(TEMP_DIR) .DS_Store node_modules

.PHONY: all build clean help version

# デフォルトターゲット
all: build

# バージョン表示
version:
	@echo "Current version: $(VERSION)"

# ビルド（配布用zipファイル作成）
build: clean
	@echo "Building Web Local Tools v$(VERSION)..."
	
	# distディレクトリを作成
	@mkdir -p $(DIST_DIR)
	@mkdir -p $(TEMP_DIR)
	
	# srcディレクトリから必要なファイルを一時ディレクトリにコピー
	@echo "Copying files from $(SRC_DIR)..."
	@cd $(SRC_DIR) && cp $(INCLUDE_FILES) ../$(TEMP_DIR)/ 2>/dev/null || true
	@cd $(SRC_DIR) && for dir in $(INCLUDE_DIRS); do \
		if [ -d "$$dir" ]; then \
			cp -r "$$dir" ../$(TEMP_DIR)/; \
		fi; \
	done
	
	# zipファイルを作成
	@echo "Creating zip file: $(ZIP_NAME)"
	@cd $(TEMP_DIR) && zip -r ../$(DIST_DIR)/$(ZIP_NAME) . -x "*.DS_Store" "*/.DS_Store"
	
	# Chrome拡張機能用のzipも作成（下位互換用）
	@cp $(DIST_DIR)/$(ZIP_NAME) $(DIST_DIR)/$(CHROME_EXT_ZIP)
	
	# 一時ディレクトリを削除
	@rm -rf $(TEMP_DIR)
	
	@echo "Build completed successfully!"
	@echo "Files created in $(DIST_DIR):"
	@ls -la $(DIST_DIR)/

# 開発用ビルド（既存のbuild.shと同等）
dev-build:
	@echo "Running development build..."
	@if [ -f "build.sh" ]; then \
		cd $(SRC_DIR) && chmod +x ../build.sh && ../build.sh; \
	else \
		echo "build.sh not found"; \
	fi

# クリーンアップ
clean:
	@echo "Cleaning up..."
	@rm -rf $(DIST_DIR)
	@rm -rf $(TEMP_DIR)
	@rm -f *.zip
	@echo "Cleanup completed."

# distディレクトリの中身を表示
list:
	@if [ -d "$(DIST_DIR)" ]; then \
		echo "Contents of $(DIST_DIR):"; \
		ls -la $(DIST_DIR)/; \
	else \
		echo "$(DIST_DIR) directory does not exist. Run 'make build' first."; \
	fi

# zipファイルの内容を確認
check:
	@if [ -f "$(DIST_DIR)/$(ZIP_NAME)" ]; then \
		echo "Contents of $(ZIP_NAME):"; \
		unzip -l $(DIST_DIR)/$(ZIP_NAME); \
	else \
		echo "$(ZIP_NAME) not found. Run 'make build' first."; \
	fi

# zipファイルの整合性をテスト
test:
	@if [ -f "$(DIST_DIR)/$(ZIP_NAME)" ]; then \
		echo "Testing $(ZIP_NAME) integrity..."; \
		unzip -t $(DIST_DIR)/$(ZIP_NAME) && echo "✓ Zip file is valid"; \
	else \
		echo "$(ZIP_NAME) not found. Run 'make build' first."; \
	fi

# ヘルプ
help:
	@echo "Web Local Tools Chrome Extension Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build      - Create distribution zip file in $(DIST_DIR)/"
	@echo "  dev-build  - Run development build (uses build.sh)"
	@echo "  clean      - Remove generated files and directories"
	@echo "  version    - Display current version from $(SRC_DIR)/manifest.json"
	@echo "  list       - List contents of $(DIST_DIR)/"
	@echo "  check      - Show contents of the zip file"
	@echo "  test       - Test zip file integrity"
	@echo "  help       - Show this help message"
	@echo ""
	@echo "Source directory: $(SRC_DIR)/"
	@echo "Current version: $(VERSION)"
	@echo "Output file: $(DIST_DIR)/$(ZIP_NAME)"