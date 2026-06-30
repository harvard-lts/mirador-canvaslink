import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translations from '../src/locales';

// MiradorMenuButton renders its children inside a real <button> so we can
// assert on the rendered output without pulling in the full Mirador bundle.
vi.mock('mirador', () => ({
  MiradorMenuButton: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  ScrollIndicatedDialogContent: ({ children }) => <div>{children}</div>,
  cssNs: (s) => `mirador-${s}`,
}));

// A real i18n instance loaded with the plugin's English translations, so
// components that use the useTranslation() hook resolve real strings.
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: translations.en } },
  interpolation: { escapeValue: false },
});

const renderWithI18n = (ui) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

describe('ShareControl', () => {
  const baseConfig = { dialogOpen: false, enabled: true, singleCanvasOnly: false };

  it('renders a share button when enabled', async () => {
    const { default: ShareControl } = await import('../src/components/ShareControl.jsx');
    const { container } = renderWithI18n(
      <ShareControl
        config={baseConfig}
        updateConfig={vi.fn()}
        windowViewType="single"
      />,
    );
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('renders nothing when disabled', async () => {
    const { default: ShareControl } = await import('../src/components/ShareControl.jsx');
    const { container } = renderWithI18n(
      <ShareControl
        config={{ ...baseConfig, enabled: false }}
        updateConfig={vi.fn()}
        windowViewType="single"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing in gallery view', async () => {
    const { default: ShareControl } = await import('../src/components/ShareControl.jsx');
    const { container } = renderWithI18n(
      <ShareControl
        config={baseConfig}
        updateConfig={vi.fn()}
        windowViewType="gallery"
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('InfoPanelCanvasLink', () => {
  const TargetComponent = () => <div data-testid="target" />;

  it('renders the wrapped target and canvas links when enabled', async () => {
    const { default: descriptor } = await import('../src/components/InfoPanelCanvasLink.jsx');
    const Comp = descriptor.component;
    const { getByTestId, getAllByRole } = renderWithI18n(
      <Comp
        config={{
          infoPanelEnabled: true,
          getCanvasLink: () => 'https://example.org/view?page=1',
        }}
        manifestId="manifest-1"
        visibleCanvases={[{ id: 'c1' }]}
        TargetComponent={TargetComponent}
        targetProps={{}}
      />,
    );
    expect(getByTestId('target')).toBeTruthy();
    // object link (no query) + canvas permalink (with query)
    const links = getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(links).toContain('https://example.org/view');
    expect(links).toContain('https://example.org/view?page=1');
  });

  it('renders only the target when infoPanel is disabled', async () => {
    const { default: descriptor } = await import('../src/components/InfoPanelCanvasLink.jsx');
    const Comp = descriptor.component;
    const { getByTestId, queryAllByRole } = renderWithI18n(
      <Comp
        config={{ infoPanelEnabled: false, getCanvasLink: () => 'https://x/?p=1' }}
        manifestId="manifest-1"
        visibleCanvases={[{ id: 'c1' }]}
        TargetComponent={TargetComponent}
        targetProps={{}}
      />,
    );
    expect(getByTestId('target')).toBeTruthy();
    expect(queryAllByRole('link')).toHaveLength(0);
  });
});

describe('RightsInformation', () => {
  it('renders nothing without rights', async () => {
    const { default: RightsInformation } = await import('../src/components/dialog/RightsInformation.jsx');
    const { container } = renderWithI18n(<RightsInformation rights={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a single rights link', async () => {
    const { default: RightsInformation } = await import('../src/components/dialog/RightsInformation.jsx');
    const { getByRole } = renderWithI18n(
      <RightsInformation rights={['https://rights.example/1']} />,
    );
    expect(getByRole('link').getAttribute('href')).toBe('https://rights.example/1');
  });

  it('renders a list of rights links', async () => {
    const { default: RightsInformation } = await import('../src/components/dialog/RightsInformation.jsx');
    const { getAllByRole } = renderWithI18n(
      <RightsInformation rights={['https://a.example', 'https://b.example']} />,
    );
    expect(getAllByRole('link')).toHaveLength(2);
  });
});

describe('CopyToClipboard', () => {
  it('renders a button when supported', async () => {
    const { default: CopyToClipboard } = await import('../src/components/dialog/CopyToClipboard.jsx');
    const { container } = renderWithI18n(
      <CopyToClipboard onCopy={vi.fn()} supported />,
    );
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('renders nothing when unsupported', async () => {
    const { default: CopyToClipboard } = await import('../src/components/dialog/CopyToClipboard.jsx');
    const { container } = renderWithI18n(
      <CopyToClipboard onCopy={vi.fn()} supported={false} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('ShareButton', () => {
  it('renders a provider link', async () => {
    const { default: ShareButton } = await import('../src/components/dialog/ShareButton.jsx');
    const { container } = renderWithI18n(
      <ShareButton
        canvasLink="https://example.org/view"
        label="My Object"
        provider="twitter"
        thumbnailUrl="https://example.org/thumb.jpg"
        title="Share on Twitter"
      />,
    );
    const btn = container.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('href')).toContain('twitter.com');
  });
});
