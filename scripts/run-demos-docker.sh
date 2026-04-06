#!/usr/bin/env bash
# ==============================================================================
# Docker Demo Runner for pajussara_tui_comp
# ==============================================================================
# Builds a Docker image (Dockerfile.demos) and runs every demo in demos/ inside
# an isolated container with a full TTY so the Ink TUI renders correctly.
#
# Usage:
#   bash scripts/run-demos-docker.sh [OPTIONS]
#
# Options:
#   --timeout N     Auto-exit each demo after N seconds instead of waiting for
#                   the user to press q  (useful for CI / smoke-testing)
#   --filter PAT    Only run demos whose filename contains PAT (substring match)
#   --no-build      Skip the image build step and reuse the last built image
#   -h, --help      Show this help message
#
# Examples:
#   bash scripts/run-demos-docker.sh
#   bash scripts/run-demos-docker.sh --filter listpanel
#   bash scripts/run-demos-docker.sh --timeout 5
#   bash scripts/run-demos-docker.sh --timeout 5 --filter status-chronometer
#   bash scripts/run-demos-docker.sh --no-build --filter cities2
# ==============================================================================

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
# shellcheck source=scripts/colors.sh
source "$(dirname "${BASH_SOURCE[0]}")/colors.sh"

info()    { echo -e "${BLUE}ℹ  $*${NC}"; }
success() { echo -e "${GREEN}✓  $*${NC}"; }
warn()    { echo -e "${YELLOW}⚠  $*${NC}"; }
error()   { echo -e "${RED}✗  $*${NC}" >&2; }
header()  { echo -e "${BLUE}── $* ──────────────────────────────────────────${NC}"; }

# ── Resolve project root ──────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_ROOT}"

# ── Defaults ──────────────────────────────────────────────────────────────────
IMAGE_NAME="pajussara_tui_comp-demos"
DEMO_TIMEOUT=""          # empty = interactive (user presses q)
FILTER=""                # empty = all demos
SKIP_BUILD=false

# ── Parse arguments ───────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --timeout)
      [[ -z "${2:-}" ]] && { error "--timeout requires a numeric argument"; exit 1; }
      DEMO_TIMEOUT="$2"; shift 2 ;;
    --filter)
      [[ -z "${2:-}" ]] && { error "--filter requires a pattern argument"; exit 1; }
      FILTER="$2"; shift 2 ;;
    --no-build)
      SKIP_BUILD=true; shift ;;
    -h|--help)
      sed -n '/^# Usage:/,/^# ====/p' "$0" | sed 's/^# \?//'
      exit 0 ;;
    *)
      error "Unknown option: $1  (use -h for help)"
      exit 1 ;;
  esac
done

# ── Discover demo files ───────────────────────────────────────────────────────
mapfile -t ALL_DEMOS < <(find "${PROJECT_ROOT}/demos" -maxdepth 1 -name "*.tsx" | sort)

if [[ ${#ALL_DEMOS[@]} -eq 0 ]]; then
  error "No .tsx files found in demos/"
  exit 1
fi

if [[ -n "${FILTER}" ]]; then
  DEMOS=()
  for f in "${ALL_DEMOS[@]}"; do
    [[ "$(basename "${f}")" == *"${FILTER}"* ]] && DEMOS+=("${f}")
  done
  if [[ ${#DEMOS[@]} -eq 0 ]]; then
    error "No demos match filter '${FILTER}'"
    exit 1
  fi
else
  DEMOS=("${ALL_DEMOS[@]}")
fi

TOTAL=${#DEMOS[@]}

# ── Header ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔═════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  pajussara_tui_comp  ·  Docker Demo Runner  ║${NC}"
echo -e "${BLUE}╚═════════════════════════════════════════════╝${NC}"
echo ""
info "Project root : ${PROJECT_ROOT}"
info "Image        : ${IMAGE_NAME}  (Dockerfile.demos)"
info "Demos found  : ${TOTAL}"
if [[ -n "${FILTER}" ]]; then
  info "Filter       : ${FILTER}"
fi
if [[ -n "${DEMO_TIMEOUT}" ]]; then
  info "Timeout      : ${DEMO_TIMEOUT}s per demo (auto-exit)"
else
  info "Mode         : interactive — press  q  to advance to the next demo"
fi
echo ""

# ── Pre-flight: docker daemon ─────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  error "docker not found in PATH — please install Docker and try again."
  exit 1
fi

if ! docker info &>/dev/null; then
  error "Docker daemon is not running — please start it and try again."
  exit 1
fi

# ── Build image ───────────────────────────────────────────────────────────────
if [[ "${SKIP_BUILD}" == false ]]; then
  info "Building Docker image (${IMAGE_NAME}) …"
  docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -t "${IMAGE_NAME}" \
    -f "${PROJECT_ROOT}/Dockerfile.demos" \
    "${PROJECT_ROOT}"
  success "Image built: ${IMAGE_NAME}"
  echo ""
else
  warn "Skipping image build (--no-build)"
  echo ""
fi

# ── Run demos ─────────────────────────────────────────────────────────────────
PASSED=0
FAILED=0

for i in "${!DEMOS[@]}"; do
  demo_path="${DEMOS[$i]}"
  demo_name="$(basename "${demo_path}")"
  demo_num=$((i + 1))

  echo ""
  header "Demo ${demo_num}/${TOTAL}: ${demo_name}"
  echo ""

  if [[ -n "${DEMO_TIMEOUT}" ]]; then
    run_cmd="timeout ${DEMO_TIMEOUT} npx --yes tsx demos/${demo_name} || true"
  else
    run_cmd="npx --yes tsx demos/${demo_name}"
  fi

  set +e
  docker run \
    --rm \
    --interactive \
    --tty \
    --name "${IMAGE_NAME}-demo-${demo_num}" \
    "${IMAGE_NAME}" \
    sh -c "${run_cmd}"
  EXIT_CODE=$?
  set -e

  echo ""

  # timeout(1) exits with 124 when it kills the process; treat that as success
  if [[ ${EXIT_CODE} -eq 0 || ${EXIT_CODE} -eq 124 ]]; then
    success "Demo ${demo_num}/${TOTAL} (${demo_name}) completed"
    PASSED=$((PASSED + 1))
  else
    warn "Demo ${demo_num}/${TOTAL} (${demo_name}) exited with code ${EXIT_CODE}"
    FAILED=$((FAILED + 1))
  fi
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo -e "  Total   : ${TOTAL}"
echo -e "  ${GREEN}Passed  : ${PASSED}${NC}"
if [[ ${FAILED} -gt 0 ]]; then
  echo -e "  ${RED}Failed  : ${FAILED}${NC}"
fi
echo ""

if [[ ${FAILED} -eq 0 ]]; then
  success "All demos ran successfully 🎉"
  exit 0
else
  error "${FAILED} demo(s) failed"
  exit 1
fi
