export async function configureUnoCSS() {
  const { default: unoPlugin } = await import('unocss/vite');
  const { presetUno, presetAttributify, presetIcons } = await import('unocss');

  return unoPlugin({
    presets: [presetUno(), presetAttributify(), presetIcons()],
  });
}
