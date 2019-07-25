'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _readPkgUp = require('read-pkg-up');

var _readPkgUp2 = _interopRequireDefault(_readPkgUp);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _resolve = require('eslint-module-utils/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _importType = require('../core/importType');

var _importType2 = _interopRequireDefault(_importType);

var _staticRequire = require('../core/staticRequire');

var _staticRequire2 = _interopRequireDefault(_staticRequire);

var _docsUrl = require('../docsUrl');

var _docsUrl2 = _interopRequireDefault(_docsUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasKeys() {
  let obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.keys(obj).length > 0;
}

function extractDepFields(pkg) {
  return {
    dependencies: pkg.dependencies || {},
    devDependencies: pkg.devDependencies || {},
    optionalDependencies: pkg.optionalDependencies || {},
    peerDependencies: pkg.peerDependencies || {}
  };
}

function getDependencies(context, packageDir) {
  let paths = [];
  try {
    const packageContent = {
      dependencies: {},
      devDependencies: {},
      optionalDependencies: {},
      peerDependencies: {}
    };

    if (!(0, _lodash.isEmpty)(packageDir)) {
      if (!(0, _lodash.isArray)(packageDir)) {
        paths = [_path2.default.resolve(packageDir)];
      } else {
        paths = packageDir.map(dir => _path2.default.resolve(dir));
      }
    }

    if (!(0, _lodash.isEmpty)(paths)) {
      // use rule config to find package.json
      paths.forEach(dir => {
        Object.assign(packageContent, extractDepFields(JSON.parse(_fs2.default.readFileSync(_path2.default.join(dir, 'package.json'), 'utf8'))));
      });
    } else {
      // use closest package.json
      Object.assign(packageContent, extractDepFields(_readPkgUp2.default.sync({ cwd: context.getFilename(), normalize: false }).pkg));
    }

    if (![packageContent.dependencies, packageContent.devDependencies, packageContent.optionalDependencies, packageContent.peerDependencies].some(hasKeys)) {
      return null;
    }

    return packageContent;
  } catch (e) {
    if (!(0, _lodash.isEmpty)(paths) && e.code === 'ENOENT') {
      context.report({
        message: 'The package.json file could not be found.',
        loc: { line: 0, column: 0 }
      });
    }
    if (e.name === 'JSONError' || e instanceof SyntaxError) {
      context.report({
        message: 'The package.json file could not be parsed: ' + e.message,
        loc: { line: 0, column: 0 }
      });
    }

    return null;
  }
}

function missingErrorMessage(packageName) {
  return `'${packageName}' should be listed in the project's dependencies. ` + `Run 'npm i -S ${packageName}' to add it`;
}

function devDepErrorMessage(packageName) {
  return `'${packageName}' should be listed in the project's dependencies, not devDependencies.`;
}

function optDepErrorMessage(packageName) {
  return `'${packageName}' should be listed in the project's dependencies, ` + `not optionalDependencies.`;
}

function reportIfMissing(context, deps, depsOptions, node, name) {
  // Do not report when importing types
  if (node.importKind === 'type') {
    return;
  }

  if ((0, _importType2.default)(name, context) !== 'external') {
    return;
  }

  const resolved = (0, _resolve2.default)(name, context);
  if (!resolved) {
    return;
  }

  const splitName = name.split('/');
  const packageName = splitName[0][0] === '@' ? splitName.slice(0, 2).join('/') : splitName[0];
  const isInDeps = deps.dependencies[packageName] !== undefined;
  const isInDevDeps = deps.devDependencies[packageName] !== undefined;
  const isInOptDeps = deps.optionalDependencies[packageName] !== undefined;
  const isInPeerDeps = deps.peerDependencies[packageName] !== undefined;

  if (isInDeps || depsOptions.allowDevDeps && isInDevDeps || depsOptions.allowPeerDeps && isInPeerDeps || depsOptions.allowOptDeps && isInOptDeps) {
    return;
  }

  if (isInDevDeps && !depsOptions.allowDevDeps) {
    context.report(node, devDepErrorMessage(packageName));
    return;
  }

  if (isInOptDeps && !depsOptions.allowOptDeps) {
    context.report(node, optDepErrorMessage(packageName));
    return;
  }

  context.report(node, missingErrorMessage(packageName));
}

function testConfig(config, filename) {
  // Simplest configuration first, either a boolean or nothing.
  if (typeof config === 'boolean' || typeof config === 'undefined') {
    return config;
  }
  // Array of globs.
  return config.some(c => (0, _minimatch2.default)(filename, c) || (0, _minimatch2.default)(filename, _path2.default.join(process.cwd(), c)));
}

module.exports = {
  meta: {
    docs: {
      url: (0, _docsUrl2.default)('no-extraneous-dependencies')
    },

    schema: [{
      'type': 'object',
      'properties': {
        'devDependencies': { 'type': ['boolean', 'array'] },
        'optionalDependencies': { 'type': ['boolean', 'array'] },
        'peerDependencies': { 'type': ['boolean', 'array'] },
        'packageDir': { 'type': ['string', 'array'] }
      },
      'additionalProperties': false
    }]
  },

  create: function (context) {
    const options = context.options[0] || {};
    const filename = context.getFilename();
    const deps = getDependencies(context, options.packageDir);

    if (!deps) {
      return {};
    }

    const depsOptions = {
      allowDevDeps: testConfig(options.devDependencies, filename) !== false,
      allowOptDeps: testConfig(options.optionalDependencies, filename) !== false,
      allowPeerDeps: testConfig(options.peerDependencies, filename) !== false

      // todo: use module visitor from module-utils core
    };return {
      ImportDeclaration: function (node) {
        reportIfMissing(context, deps, depsOptions, node, node.source.value);
      },
      CallExpression: function handleRequires(node) {
        if ((0, _staticRequire2.default)(node)) {
          reportIfMissing(context, deps, depsOptions, node, node.arguments[0].value);
        }
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLmpzIl0sIm5hbWVzIjpbImhhc0tleXMiLCJvYmoiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXh0cmFjdERlcEZpZWxkcyIsInBrZyIsImRlcGVuZGVuY2llcyIsImRldkRlcGVuZGVuY2llcyIsIm9wdGlvbmFsRGVwZW5kZW5jaWVzIiwicGVlckRlcGVuZGVuY2llcyIsImdldERlcGVuZGVuY2llcyIsImNvbnRleHQiLCJwYWNrYWdlRGlyIiwicGF0aHMiLCJwYWNrYWdlQ29udGVudCIsInBhdGgiLCJyZXNvbHZlIiwibWFwIiwiZGlyIiwiZm9yRWFjaCIsImFzc2lnbiIsIkpTT04iLCJwYXJzZSIsImZzIiwicmVhZEZpbGVTeW5jIiwiam9pbiIsInJlYWRQa2dVcCIsInN5bmMiLCJjd2QiLCJnZXRGaWxlbmFtZSIsIm5vcm1hbGl6ZSIsInNvbWUiLCJlIiwiY29kZSIsInJlcG9ydCIsIm1lc3NhZ2UiLCJsb2MiLCJsaW5lIiwiY29sdW1uIiwibmFtZSIsIlN5bnRheEVycm9yIiwibWlzc2luZ0Vycm9yTWVzc2FnZSIsInBhY2thZ2VOYW1lIiwiZGV2RGVwRXJyb3JNZXNzYWdlIiwib3B0RGVwRXJyb3JNZXNzYWdlIiwicmVwb3J0SWZNaXNzaW5nIiwiZGVwcyIsImRlcHNPcHRpb25zIiwibm9kZSIsImltcG9ydEtpbmQiLCJyZXNvbHZlZCIsInNwbGl0TmFtZSIsInNwbGl0Iiwic2xpY2UiLCJpc0luRGVwcyIsInVuZGVmaW5lZCIsImlzSW5EZXZEZXBzIiwiaXNJbk9wdERlcHMiLCJpc0luUGVlckRlcHMiLCJhbGxvd0RldkRlcHMiLCJhbGxvd1BlZXJEZXBzIiwiYWxsb3dPcHREZXBzIiwidGVzdENvbmZpZyIsImNvbmZpZyIsImZpbGVuYW1lIiwiYyIsInByb2Nlc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJvcHRpb25zIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzb3VyY2UiLCJ2YWx1ZSIsIkNhbGxFeHByZXNzaW9uIiwiaGFuZGxlUmVxdWlyZXMiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsT0FBVCxHQUEyQjtBQUFBLE1BQVZDLEdBQVUsdUVBQUosRUFBSTs7QUFDekIsU0FBT0MsT0FBT0MsSUFBUCxDQUFZRixHQUFaLEVBQWlCRyxNQUFqQixHQUEwQixDQUFqQztBQUNEOztBQUVELFNBQVNDLGdCQUFULENBQTBCQyxHQUExQixFQUErQjtBQUM3QixTQUFPO0FBQ0xDLGtCQUFjRCxJQUFJQyxZQUFKLElBQW9CLEVBRDdCO0FBRUxDLHFCQUFpQkYsSUFBSUUsZUFBSixJQUF1QixFQUZuQztBQUdMQywwQkFBc0JILElBQUlHLG9CQUFKLElBQTRCLEVBSDdDO0FBSUxDLHNCQUFrQkosSUFBSUksZ0JBQUosSUFBd0I7QUFKckMsR0FBUDtBQU1EOztBQUVELFNBQVNDLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDQyxVQUFsQyxFQUE4QztBQUM1QyxNQUFJQyxRQUFRLEVBQVo7QUFDQSxNQUFJO0FBQ0YsVUFBTUMsaUJBQWlCO0FBQ3JCUixvQkFBYyxFQURPO0FBRXJCQyx1QkFBaUIsRUFGSTtBQUdyQkMsNEJBQXNCLEVBSEQ7QUFJckJDLHdCQUFrQjtBQUpHLEtBQXZCOztBQU9BLFFBQUksQ0FBQyxxQkFBUUcsVUFBUixDQUFMLEVBQTBCO0FBQ3hCLFVBQUksQ0FBQyxxQkFBUUEsVUFBUixDQUFMLEVBQTBCO0FBQ3hCQyxnQkFBUSxDQUFDRSxlQUFLQyxPQUFMLENBQWFKLFVBQWIsQ0FBRCxDQUFSO0FBQ0QsT0FGRCxNQUVPO0FBQ0xDLGdCQUFRRCxXQUFXSyxHQUFYLENBQWVDLE9BQU9ILGVBQUtDLE9BQUwsQ0FBYUUsR0FBYixDQUF0QixDQUFSO0FBQ0Q7QUFDRjs7QUFF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SUFBeEIsRUFBOEI7QUFDNUMsWUFBSSw2QkFBZ0JBLElBQWhCLENBQUosRUFBMkI7QUFDekJILDBCQUFnQmxDLE9BQWhCLEVBQXlCbUMsSUFBekIsRUFBK0JDLFdBQS9CLEVBQTRDQyxJQUE1QyxFQUFrREEsS0FBS2dDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCSCxLQUFwRTtBQUNEO0FBQ0Y7QUFSSSxLQUFQO0FBVUQ7QUE5Q2MsQ0FBakIiLCJmaWxlIjoicnVsZXMvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgaXNBcnJheSwgaXNFbXB0eSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCByZWFkUGtnVXAgZnJvbSAncmVhZC1wa2ctdXAnXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCdcbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSdcbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSdcbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJ1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCdcblxuZnVuY3Rpb24gaGFzS2V5cyhvYmogPSB7fSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPiAwXG59XG5cbmZ1bmN0aW9uIGV4dHJhY3REZXBGaWVsZHMocGtnKSB7XG4gIHJldHVybiB7XG4gICAgZGVwZW5kZW5jaWVzOiBwa2cuZGVwZW5kZW5jaWVzIHx8IHt9LFxuICAgIGRldkRlcGVuZGVuY2llczogcGtnLmRldkRlcGVuZGVuY2llcyB8fCB7fSxcbiAgICBvcHRpb25hbERlcGVuZGVuY2llczogcGtnLm9wdGlvbmFsRGVwZW5kZW5jaWVzIHx8IHt9LFxuICAgIHBlZXJEZXBlbmRlbmNpZXM6IHBrZy5wZWVyRGVwZW5kZW5jaWVzIHx8IHt9LFxuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlcGVuZGVuY2llcyhjb250ZXh0LCBwYWNrYWdlRGlyKSB7XG4gIGxldCBwYXRocyA9IFtdXG4gIHRyeSB7XG4gICAgY29uc3QgcGFja2FnZUNvbnRlbnQgPSB7XG4gICAgICBkZXBlbmRlbmNpZXM6IHt9LFxuICAgICAgZGV2RGVwZW5kZW5jaWVzOiB7fSxcbiAgICAgIG9wdGlvbmFsRGVwZW5kZW5jaWVzOiB7fSxcbiAgICAgIHBlZXJEZXBlbmRlbmNpZXM6IHt9LFxuICAgIH1cblxuICAgIGlmICghaXNFbXB0eShwYWNrYWdlRGlyKSkge1xuICAgICAgaWYgKCFpc0FycmF5KHBhY2thZ2VEaXIpKSB7XG4gICAgICAgIHBhdGhzID0gW3BhdGgucmVzb2x2ZShwYWNrYWdlRGlyKV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzID0gcGFja2FnZURpci5tYXAoZGlyID0+IHBhdGgucmVzb2x2ZShkaXIpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNFbXB0eShwYXRocykpIHtcbiAgICAgIC8vIHVzZSBydWxlIGNvbmZpZyB0byBmaW5kIHBhY2thZ2UuanNvblxuICAgICAgcGF0aHMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBPYmplY3QuYXNzaWduKHBhY2thZ2VDb250ZW50LCBleHRyYWN0RGVwRmllbGRzKFxuICAgICAgICAgIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihkaXIsICdwYWNrYWdlLmpzb24nKSwgJ3V0ZjgnKSlcbiAgICAgICAgKSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHVzZSBjbG9zZXN0IHBhY2thZ2UuanNvblxuICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgcGFja2FnZUNvbnRlbnQsXG4gICAgICAgIGV4dHJhY3REZXBGaWVsZHMoXG4gICAgICAgICAgcmVhZFBrZ1VwLnN5bmMoe2N3ZDogY29udGV4dC5nZXRGaWxlbmFtZSgpLCBub3JtYWxpemU6IGZhbHNlfSkucGtnXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIVtcbiAgICAgIHBhY2thZ2VDb250ZW50LmRlcGVuZGVuY2llcyxcbiAgICAgIHBhY2thZ2VDb250ZW50LmRldkRlcGVuZGVuY2llcyxcbiAgICAgIHBhY2thZ2VDb250ZW50Lm9wdGlvbmFsRGVwZW5kZW5jaWVzLFxuICAgICAgcGFja2FnZUNvbnRlbnQucGVlckRlcGVuZGVuY2llcyxcbiAgICBdLnNvbWUoaGFzS2V5cykpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhY2thZ2VDb250ZW50XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoIWlzRW1wdHkocGF0aHMpICYmIGUuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbWVzc2FnZTogJ1RoZSBwYWNrYWdlLmpzb24gZmlsZSBjb3VsZCBub3QgYmUgZm91bmQuJyxcbiAgICAgICAgbG9jOiB7IGxpbmU6IDAsIGNvbHVtbjogMCB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKGUubmFtZSA9PT0gJ0pTT05FcnJvcicgfHwgZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGUgcGFja2FnZS5qc29uIGZpbGUgY291bGQgbm90IGJlIHBhcnNlZDogJyArIGUubWVzc2FnZSxcbiAgICAgICAgbG9jOiB7IGxpbmU6IDAsIGNvbHVtbjogMCB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmZ1bmN0aW9uIG1pc3NpbmdFcnJvck1lc3NhZ2UocGFja2FnZU5hbWUpIHtcbiAgcmV0dXJuIGAnJHtwYWNrYWdlTmFtZX0nIHNob3VsZCBiZSBsaXN0ZWQgaW4gdGhlIHByb2plY3QncyBkZXBlbmRlbmNpZXMuIGAgK1xuICAgIGBSdW4gJ25wbSBpIC1TICR7cGFja2FnZU5hbWV9JyB0byBhZGQgaXRgXG59XG5cbmZ1bmN0aW9uIGRldkRlcEVycm9yTWVzc2FnZShwYWNrYWdlTmFtZSkge1xuICByZXR1cm4gYCcke3BhY2thZ2VOYW1lfScgc2hvdWxkIGJlIGxpc3RlZCBpbiB0aGUgcHJvamVjdCdzIGRlcGVuZGVuY2llcywgbm90IGRldkRlcGVuZGVuY2llcy5gXG59XG5cbmZ1bmN0aW9uIG9wdERlcEVycm9yTWVzc2FnZShwYWNrYWdlTmFtZSkge1xuICByZXR1cm4gYCcke3BhY2thZ2VOYW1lfScgc2hvdWxkIGJlIGxpc3RlZCBpbiB0aGUgcHJvamVjdCdzIGRlcGVuZGVuY2llcywgYCArXG4gICAgYG5vdCBvcHRpb25hbERlcGVuZGVuY2llcy5gXG59XG5cbmZ1bmN0aW9uIHJlcG9ydElmTWlzc2luZyhjb250ZXh0LCBkZXBzLCBkZXBzT3B0aW9ucywgbm9kZSwgbmFtZSkge1xuICAvLyBEbyBub3QgcmVwb3J0IHdoZW4gaW1wb3J0aW5nIHR5cGVzXG4gIGlmIChub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJykge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKGltcG9ydFR5cGUobmFtZSwgY29udGV4dCkgIT09ICdleHRlcm5hbCcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShuYW1lLCBjb250ZXh0KVxuICBpZiAoIXJlc29sdmVkKSB7IHJldHVybiB9XG5cbiAgY29uc3Qgc3BsaXROYW1lID0gbmFtZS5zcGxpdCgnLycpXG4gIGNvbnN0IHBhY2thZ2VOYW1lID0gc3BsaXROYW1lWzBdWzBdID09PSAnQCdcbiAgICA/IHNwbGl0TmFtZS5zbGljZSgwLCAyKS5qb2luKCcvJylcbiAgICA6IHNwbGl0TmFtZVswXVxuICBjb25zdCBpc0luRGVwcyA9IGRlcHMuZGVwZW5kZW5jaWVzW3BhY2thZ2VOYW1lXSAhPT0gdW5kZWZpbmVkXG4gIGNvbnN0IGlzSW5EZXZEZXBzID0gZGVwcy5kZXZEZXBlbmRlbmNpZXNbcGFja2FnZU5hbWVdICE9PSB1bmRlZmluZWRcbiAgY29uc3QgaXNJbk9wdERlcHMgPSBkZXBzLm9wdGlvbmFsRGVwZW5kZW5jaWVzW3BhY2thZ2VOYW1lXSAhPT0gdW5kZWZpbmVkXG4gIGNvbnN0IGlzSW5QZWVyRGVwcyA9IGRlcHMucGVlckRlcGVuZGVuY2llc1twYWNrYWdlTmFtZV0gIT09IHVuZGVmaW5lZFxuXG4gIGlmIChpc0luRGVwcyB8fFxuICAgIChkZXBzT3B0aW9ucy5hbGxvd0RldkRlcHMgJiYgaXNJbkRldkRlcHMpIHx8XG4gICAgKGRlcHNPcHRpb25zLmFsbG93UGVlckRlcHMgJiYgaXNJblBlZXJEZXBzKSB8fFxuICAgIChkZXBzT3B0aW9ucy5hbGxvd09wdERlcHMgJiYgaXNJbk9wdERlcHMpXG4gICkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKGlzSW5EZXZEZXBzICYmICFkZXBzT3B0aW9ucy5hbGxvd0RldkRlcHMpIHtcbiAgICBjb250ZXh0LnJlcG9ydChub2RlLCBkZXZEZXBFcnJvck1lc3NhZ2UocGFja2FnZU5hbWUpKVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKGlzSW5PcHREZXBzICYmICFkZXBzT3B0aW9ucy5hbGxvd09wdERlcHMpIHtcbiAgICBjb250ZXh0LnJlcG9ydChub2RlLCBvcHREZXBFcnJvck1lc3NhZ2UocGFja2FnZU5hbWUpKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29udGV4dC5yZXBvcnQobm9kZSwgbWlzc2luZ0Vycm9yTWVzc2FnZShwYWNrYWdlTmFtZSkpXG59XG5cbmZ1bmN0aW9uIHRlc3RDb25maWcoY29uZmlnLCBmaWxlbmFtZSkge1xuICAvLyBTaW1wbGVzdCBjb25maWd1cmF0aW9uIGZpcnN0LCBlaXRoZXIgYSBib29sZWFuIG9yIG5vdGhpbmcuXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGNvbmZpZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gY29uZmlnXG4gIH1cbiAgLy8gQXJyYXkgb2YgZ2xvYnMuXG4gIHJldHVybiBjb25maWcuc29tZShjID0+IChcbiAgICBtaW5pbWF0Y2goZmlsZW5hbWUsIGMpIHx8XG4gICAgbWluaW1hdGNoKGZpbGVuYW1lLCBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYykpXG4gICkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgJ3R5cGUnOiAnb2JqZWN0JyxcbiAgICAgICAgJ3Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ2RldkRlcGVuZGVuY2llcyc6IHsgJ3R5cGUnOiBbJ2Jvb2xlYW4nLCAnYXJyYXknXSB9LFxuICAgICAgICAgICdvcHRpb25hbERlcGVuZGVuY2llcyc6IHsgJ3R5cGUnOiBbJ2Jvb2xlYW4nLCAnYXJyYXknXSB9LFxuICAgICAgICAgICdwZWVyRGVwZW5kZW5jaWVzJzogeyAndHlwZSc6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgJ3BhY2thZ2VEaXInOiB7ICd0eXBlJzogWydzdHJpbmcnLCAnYXJyYXknXSB9LFxuICAgICAgICB9LFxuICAgICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fVxuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5nZXRGaWxlbmFtZSgpXG4gICAgY29uc3QgZGVwcyA9IGdldERlcGVuZGVuY2llcyhjb250ZXh0LCBvcHRpb25zLnBhY2thZ2VEaXIpXG5cbiAgICBpZiAoIWRlcHMpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIGNvbnN0IGRlcHNPcHRpb25zID0ge1xuICAgICAgYWxsb3dEZXZEZXBzOiB0ZXN0Q29uZmlnKG9wdGlvbnMuZGV2RGVwZW5kZW5jaWVzLCBmaWxlbmFtZSkgIT09IGZhbHNlLFxuICAgICAgYWxsb3dPcHREZXBzOiB0ZXN0Q29uZmlnKG9wdGlvbnMub3B0aW9uYWxEZXBlbmRlbmNpZXMsIGZpbGVuYW1lKSAhPT0gZmFsc2UsXG4gICAgICBhbGxvd1BlZXJEZXBzOiB0ZXN0Q29uZmlnKG9wdGlvbnMucGVlckRlcGVuZGVuY2llcywgZmlsZW5hbWUpICE9PSBmYWxzZSxcbiAgICB9XG5cbiAgICAvLyB0b2RvOiB1c2UgbW9kdWxlIHZpc2l0b3IgZnJvbSBtb2R1bGUtdXRpbHMgY29yZVxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmVwb3J0SWZNaXNzaW5nKGNvbnRleHQsIGRlcHMsIGRlcHNPcHRpb25zLCBub2RlLCBub2RlLnNvdXJjZS52YWx1ZSlcbiAgICAgIH0sXG4gICAgICBDYWxsRXhwcmVzc2lvbjogZnVuY3Rpb24gaGFuZGxlUmVxdWlyZXMobm9kZSkge1xuICAgICAgICBpZiAoaXNTdGF0aWNSZXF1aXJlKG5vZGUpKSB7XG4gICAgICAgICAgcmVwb3J0SWZNaXNzaW5nKGNvbnRleHQsIGRlcHMsIGRlcHNPcHRpb25zLCBub2RlLCBub2RlLmFyZ3VtZW50c1swXS52YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG4iXX0=